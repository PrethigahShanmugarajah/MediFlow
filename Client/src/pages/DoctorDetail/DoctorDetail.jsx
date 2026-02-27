// MediFlow / Client / src / pages / DoctorDetail / DoctorDetail.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarCheck, Clock, UserX } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  getPrefillFromClerkUser,
  getScheduleDates,
  getSlotsForSelectedDate,
  sanitizeMobile10,
} from "../../utils/doctorDetailUtils";
import {
  bookAppointmentApi,
  fetchBookedSlotsApi,
  fetchDoctorByIdApi,
} from "./Service/DoctorDetailService";
import Summary from "./Components/Summary";
import PatientDetailsForm from "./Components/PatientDetailsForm";
import DoctorInformation from "./Components/DoctorInformation";
import DoctorProfile from "./Components/DoctorProfile";
import NotFoundState from "../../components/NotFoundState";
import DateSelector from "./Components/DateSelector";
import TimeSlotSelector from "./Components/TimeSlotSelector";
import Header from "./Components/Header";
import DetailPageLoader from "../../components/DetailPageLoader";
import DetailErrorState from "../../components/DetailErrorState";
import { BeatLoader } from "react-spinners";

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    mobile: "",
    gender: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { isSignedIn, user, isLoaded: userLoaded } = useUser();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookedLoading, setBookedLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!userLoaded) return;
    const { fullName, phone, email } = getPrefillFromClerkUser(user);
    setFormData((prev) => ({
      ...prev,
      name: prev.name || fullName,
      mobile: prev.mobile || phone,
      email: prev.email || email,
    }));
  }, [userLoaded, user]);

  const fetchDoctorService = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const doc = await fetchDoctorByIdApi(id);
      setDoctor(doc);
      console.log("Doctor API response (doc):", doc);
      console.log("Doctor keys:", doc ? Object.keys(doc) : []);
      console.log(
        "Doctor schedule keys:",
        doc?.schedule ? Object.keys(doc.schedule) : [],
      );
    } catch (error) {
      setError(
        error?.message || "Unable to fetch doctor. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const doctorId = doctor?._id || doctor?.id;
    if (!doctorId || !selectedDate) return;

    const dateISO = selectedDate.toISOString().split("T")[0];

    let mounted = true;
    setBookedLoading(true);
    setBookedSlots([]);
    setSelectedSlot("");

    (async () => {
      try {
        const booked = await fetchBookedSlotsApi(doctorId, dateISO);
        if (!mounted) return;
        setBookedSlots(booked || []);
      } catch (error) {
        if (!mounted) return;
        setBookedSlots([]);
      } finally {
        if (!mounted) return;
        setBookedLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [doctor?._id, doctor?.id, selectedDate]);

  useEffect(() => {
    fetchDoctorService();
  }, [id]);

  const retry = () => {
    fetchDoctorService();
  };

  const next7 = useMemo(() => getScheduleDates(doctor?.schedule), [doctor]);
  const fee = Number(doctor?.fee ?? doctor?.fees ?? 0);

  const slots = useMemo(
    () => getSlotsForSelectedDate(doctor?.schedule, selectedDate),
    [doctor?.schedule, selectedDate],
  );

  const handleMobileChange = (value) => {
    setFormData((prev) => ({ ...prev, mobile: sanitizeMobile10(value) }));
  };

  const handleMobilePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, mobile: digits }));
  };

  const handleBooking = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    console.log("BOOKING TRY:", {
      selectedDate,
      dateISO: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
      selectedSlot,
      doctorId: doctor?.id || doctor?._id,
    });

    try {
      await bookAppointmentApi({
        doctor,
        formData,
        selectedDate,
        selectedSlot,
        fee,
        paymentMethod,
        authLoaded,
        userLoaded,
        isSignedIn,
        getToken,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDateISO = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  useEffect(() => {
    if (!selectedDateISO) return;
    const bookedForDate = doctor?.bookedSlots?.[selectedDateISO] || [];
    console.log("Selected Date:", selectedDateISO);
    console.log("Already Booked Slots:", bookedForDate);
  }, [selectedDateISO, doctor]);

  if (loading)
    return (
      <DetailPageLoader bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100" />
    );

  if (error)
    return (
      <DetailErrorState
        message={error}
        onRetry={retry}
        backTo="/doctors"
        backText="Back to Doctors"
        bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100"
      />
    );

  if (!doctor)
    return (
      <NotFoundState
        icon={UserX}
        title="Doctor Not Found"
        backText="Back to Doctors"
        backTo="/doctors"
        bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100"
      />
    );

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-blue-100 via-white to-indigo-100 relative overflow-hidden">
      <Header rating={doctor.rating} />

      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* -------- Profile Card -------- */}
        <div className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 sm:p-8">
            <DoctorProfile doctor={doctor} />
            <DoctorInformation doctor={doctor} fee={fee} />
          </div>
        </div>

        {/* -------- Appointment -------- */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <CalendarCheck className="w-6 h-6 text-indigo-500" />
              <h2 className="text-md md:text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Book Your Appointment
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* -------- Left Column -------- */}
              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-indigo-700 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5" />
                  Select Date
                </h3>

                <DateSelector
                  dates={next7}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />

                <PatientDetailsForm
                  formData={formData}
                  setFormData={setFormData}
                  handleMobileChange={handleMobileChange}
                  handleMobilePaste={handleMobilePaste}
                />
              </div>

              {/* -------- Right Column -------- */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Available Time Slots
                </h3>

                {!selectedDate ? (
                  <p className="text-gray-500">
                    Please select a date to view slots.
                  </p>
                ) : bookedLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <BeatLoader size={10} color="#6366F1" />
                  </div>
                ) : (
                  <TimeSlotSelector
                    slots={slots}
                    bookedSlots={bookedSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    hideBooked={true}
                  />
                )}

                <Summary
                  doctor={doctor}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  fee={fee}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  handleBooking={handleBooking}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
