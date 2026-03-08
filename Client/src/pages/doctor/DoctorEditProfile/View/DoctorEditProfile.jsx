import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addDateToDocSchedule,
  addSlotToDocSchedule,
  removeDateFromDocSchedule,
  removeSlotFromDocSchedule,
} from "../../../../utils/doctor/doctorEditProfileUtils";
import "../DoctorEditProfile.css";
import { toast } from "react-toastify";
import {
  changeDoctorAvailabilityApi,
  fetchDoctorProfileApi,
  saveDoctorProfileApi,
} from "../Service/DoctorEditProfileService";
import DetailPageLoader from "../../../../components/common/DetailPageLoader";
import NotFoundState from "../../../../components/common/NotFoundState";
import ProfileImageHeader from "../Components/ProfileImageHeader";
import ProfileHeader from "../Components/ProfileHeader";
import PersonalInformation from "../Components/PersonalInformation";
import AboutSection from "../Components/AboutSection";
import ScheduleSection from "../Components/ScheduleSection";
import ProfileActions from "../Components/ProfileActions";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

const DoctorEditProfile = () => {
  const { id } = useParams();

  const [doc, setDoc] = useState(null);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [localImageFile, setLocalImageFile] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchDoctorService() {
      try {
        setLoading(true);
        setSaveMessage(null);
        const result = await fetchDoctorProfileApi(id);
        if (!result.ok) {
          if (!cancelled) {
            setDoc(null);
            setSaveMessage({ type: "error", text: result.message });
          }
          return;
        }
        if (!cancelled) {
          setDoc(result.doctor);
          setImagePreview(result.doctor.imageUrl || "");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) fetchDoctorService();
    return () => {
      cancelled = true;
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [id]);

  const addDate = (dateStr) => {
    const result = addDateToDocSchedule(doc, dateStr);
    if (!result.ok) return toast.error(result.message);
    setDoc(result.doc);
    toast.success(result.message);
  };

  const addSlot = (dateStr, time) => {
    const result = addSlotToDocSchedule(doc, dateStr, time);
    if (!result.ok) return toast.error(result.message);
    setDoc(result.doc);
    toast.success(result.message);
  };

  const removeSlot = (dateStr, slot) => {
    const result = removeSlotFromDocSchedule(doc, dateStr, slot);
    if (!result.ok) return;
    setDoc(result.doc);
    toast.info(result.message);
  };

  const removeDate = (dateStr) => {
    const result = removeDateFromDocSchedule(doc, dateStr);
    if (!result.ok) return;
    setDoc(result.doc);
    toast.info(result.message);
  };

  const handleImageChange = (e) => {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview && imagePreview.startsWith("blob:"))
      URL.revokeObjectURL(imagePreview);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setLocalImageFile(file);
    setDoc((d) => ({ ...d, imageUrl: url }));
    toast.success("The profile image was updated locally.");
  };

  const toggleAvailability = async () => {
    if (!doc) return;
    const token = localStorage.getItem(STORAGE_KEY);
    const result = await changeDoctorAvailabilityApi({
      id,
      token,
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setDoc(result.doctor);
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setSaveMessage({ type: "saving", text: "Resetting profile..." });
      const result = await fetchDoctorProfileApi(id);
      if (!result.ok) {
        setSaveMessage({ type: "error", text: result.message });
        setTimeout(() => setSaveMessage(null), 2000);
        return;
      }
      setDoc(result.doctor);
      setImagePreview(result.doctor.imageUrl || "");
      setLocalImageFile(null);
      setEditing(false);
      setSaveMessage({ type: "success", text: "Profile reset successfully." });
      setTimeout(() => setSaveMessage(null), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!doc) return;
    setSaveMessage({ type: "saving", text: "Saving profile..." });
    const token = localStorage.getItem(STORAGE_KEY);
    const result = await saveDoctorProfileApi({
      id,
      doc,
      localImageFile,
      token,
    });
    if (!result.ok) {
      setSaveMessage({ type: "error", text: result.message });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }
    setDoc(result.doctor);
    setLocalImageFile(null);
    setImagePreview(result.doctor.imageUrl || imagePreview);
    setEditing(false);
    setSaveMessage({ type: "success", text: "Profile saved successfully!" });
    setTimeout(() => setSaveMessage(null), 1500);
  };

  if (loading) {
    return (
      <DetailPageLoader
        fullPage
        bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100"
      />
    );
  }

  if (!doc) {
    return (
      <NotFoundState
        title="Doctor profile not found."
        backText={null}
        backTo={null}
        bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100"
      />
    );
  }

  const isAvailable = doc.availability === "Available" || doc.available;

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-blue-100 via-white to-indigo-100 p-4 sm:p-5 md:p-6">
      <div className="max-w-6xl pt-8 md:pt-10 mx-auto relative">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-indigo-100/50">
          <ProfileImageHeader
            doc={doc}
            imagePreview={imagePreview}
            editing={editing}
            handleImageChange={handleImageChange}
          />

          <div className="pt-20 pb-8 px-4 sm:px-6 md:px-8">
            <ProfileHeader
              doc={doc}
              editing={editing}
              isAvailable={isAvailable}
              toggleAvailability={toggleAvailability}
              onToggleEditing={() => setEditing((s) => !s)}
            />

            <PersonalInformation doc={doc} setDoc={setDoc} editing={editing} />

            <AboutSection doc={doc} setDoc={setDoc} editing={editing} />

            <ScheduleSection
              doc={doc}
              editing={editing}
              saveMessage={saveMessage}
              addDate={addDate}
              addSlot={addSlot}
              removeDate={removeDate}
              removeSlot={removeSlot}
            />

            <ProfileActions
              editing={editing}
              saveMessage={saveMessage}
              onReset={handleReset}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorEditProfile;
