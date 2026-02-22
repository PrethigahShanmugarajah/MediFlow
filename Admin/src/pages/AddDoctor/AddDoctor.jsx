// MediFlow / Admin / src / pages / AddDoctor / AddDoctor.jsx
import { useRef, useState } from "react";
import { User, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  addSlotToSchedule,
  buildDoctorFormData,
  canAddSlot,
  clearImagePreview,
  createImagePreview,
  getFlatSlots,
  getTodayISO,
  initialDoctorForm,
  removeSlotFromSchedule,
  safeClearFileInput,
  validateDoctorForm,
} from "../../utils/addDoctorUtils";
import { addDoctor } from "./Service/AddDoctorService";
import { FileInputField } from "../../components/FormField/FileInputField";
import DoctorPreviewList from "./Components/DoctorPreviewList";
import DoctorScheduleBuilder from "./Components/DoctorScheduleBuilder";
import DoctorBasicFields from "./Components/DoctorBasicFields";
import { ClipLoader } from "react-spinners";

const AddDoctor = () => {
  const [doctorList, setDoctorList] = useState([]);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialDoctorForm);
  const [slotDate, setSlotDate] = useState("");
  const [slotHour, setSlotHour] = useState("");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotAmpm, setSlotAmpm] = useState("AM");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [today] = useState(getTodayISO);

  function removeImage() {
    clearImagePreview(form.imagePreview);
    setForm((p) => ({ ...p, imageFile: null, imagePreview: "" }));
    safeClearFileInput(fileInputRef);
  }

  function addSlotToForm() {
    const res = canAddSlot({
      slotDate,
      slotHour,
      slotMinute,
      slotAmpm,
      today,
    });

    if (!res.ok) {
      toast.error(res.message);
      return;
    }

    setForm((f) => ({
      ...f,
      schedule: addSlotToSchedule(f.schedule, slotDate, res.time),
    }));

    setSlotHour("");
    setSlotMinute("00");
  }

  function removeSlot(date, time) {
    setForm((f) => ({
      ...f,
      schedule: removeSlotFromSchedule(f.schedule, date, time),
    }));
  }

  async function handleAdd(e) {
    e.preventDefault();

    const v = validateDoctorForm(form);
    if (!v.ok) {
      toast.error(v.message);
      return;
    }

    setLoading(true);

    try {
      const fd = buildDoctorFormData(form);

      const { doctor } = await addDoctor(fd, form);

      setDoctorList((old) => [doctor, ...old]);

      clearImagePreview(form.imagePreview);

      setForm(initialDoctorForm());
      safeClearFileInput(fileInputRef);

      setSlotDate("");
      setSlotHour("");
      setSlotMinute("00");
      setSlotAmpm("AM");
      setShowPassword(false);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h- font-serif from-indigo-100 via-white to-blue-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-500 rounded-full shadow-lg">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent mt-2 sm:mt-0">
            Add New Doctor
          </h1>
        </div>
      </div>

      {/* -------- Form -------- */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-2xl p-6 sm:p-8 rounded-3xl mb-16">
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-4">
              <FileInputField
                label="Upload Profile Image"
                labelPosition="top"
                name="doctorImage"
                accept="image/*"
                size="m"
                required
                value={form.imageFile}
                inputClassName="w-40 leading-none"
                labelClassName=""
                onChange={(files) => {
                  const file = files?.[0] || null;
                  if (!file) return;

                  setForm((p) => {
                    const next = createImagePreview(file, p.imagePreview);
                    return { ...p, ...next };
                  });
                }}
              />

              {form.imagePreview && (
                <div className="relative group">
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="h-16 w-16 md:h-20 md:w-20 rounded-full shadow-md border border-indigo-200 object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <DoctorBasicFields
            form={form}
            setForm={setForm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <DoctorScheduleBuilder
            today={today}
            slotDate={slotDate}
            setSlotDate={setSlotDate}
            slotHour={slotHour}
            setSlotHour={setSlotHour}
            slotMinute={slotMinute}
            setSlotMinute={setSlotMinute}
            slotAmpm={slotAmpm}
            setSlotAmpm={setSlotAmpm}
            addSlotToForm={addSlotToForm}
            form={form}
            removeSlot={removeSlot}
            getFlatSlots={getFlatSlots}
          />

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 rounded-full font-semibold shadow-xl w-full md:w-auto ${
                loading
                  ? "opacity-60 cursor-not-allowed border border-indigo-500"
                  : "bg-linear-to-r from-indigo-500 to-teal-500 text-white"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center w-full">
                  <ClipLoader size={20} color="#6366F1" />
                </div>
              ) : (
                "Add Doctor to Team"
              )}
            </button>
          </div>
        </form>
      </div>

      <DoctorPreviewList doctorList={doctorList} />
    </div>
  );
};

export default AddDoctor;
