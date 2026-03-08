import { useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import {
  addSlotToSchedule,
  buildDoctorFormData,
  canAddSlot,
  clearImagePreview,
  getCurrentTimeNow,
  getFlatSlots,
  initialDoctorForm,
  removeSlotFromSchedule,
  safeClearFileInput,
  validateDoctorForm,
} from "../../../utils/addDoctorUtils";
import { getTodayISO } from "../../../utils/helpers";
import { addDoctor } from "../Service/AddDoctorService";
import DoctorPreviewList from "../Components/DoctorPreviewList";
import DoctorScheduleBuilder from "../Components/DoctorScheduleBuilder";
import DoctorBasicFields from "../Components/DoctorBasicFields";
import { ClipLoader } from "react-spinners";
import Title from "../../../components/Title";
import DoctorImageCard from "../Components/DoctorImageCard";

const AddDoctor = () => {
  const [doctorList, setDoctorList] = useState([]);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialDoctorForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [today] = useState(getTodayISO);

  const [slotDate, setSlotDate] = useState(today);
  const [initialTime] = useState(() => getCurrentTimeNow());
  const [slotHour, setSlotHour] = useState(initialTime.hour);
  const [slotMinute, setSlotMinute] = useState(initialTime.minute);
  const [slotAmpm, setSlotAmpm] = useState(initialTime.ampm);

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

    const next = getCurrentTimeNow();
    setSlotHour(next.hour);
    setSlotMinute(next.minute);
    setSlotAmpm(next.ampm);
  }

  function removeSlot(date, time) {
    setForm((f) => ({
      ...f,
      schedule: removeSlotFromSchedule(f.schedule, date, time),
    }));
  }

  function resetDoctorForm() {
    clearImagePreview(form.imagePreview);
    setForm(initialDoctorForm());
    safeClearFileInput(fileInputRef);
    const nowTime = getCurrentTimeNow();
    setSlotDate(getTodayISO());
    setSlotHour(nowTime.hour);
    setSlotMinute(nowTime.minute);
    setSlotAmpm(nowTime.ampm);
    setShowPassword(false);
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
      {/* -------- Form -------- */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-2xl p-6 sm:p-8 rounded-3xl mb-16">
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Title
              title="Add New Doctor"
              subtitle="Create doctor profile and set availability"
              wrapperClassName="mb-0"
            />

            <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={resetDoctorForm}
                className="w-full sm:w-auto px-6 py-2 rounded-full bg-white border border-indigo-100 hover:shadow transition-shadow duration-200"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center items-center gap-2 px-6 py-2 rounded-full font-semibold shadow-xl w-full sm:w-auto ${
                  loading
                    ? "opacity-60 cursor-not-allowed border border-indigo-500"
                    : "bg-linear-to-r from-indigo-500 to-teal-500 text-white"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={18} color="#6366F1" />
                  </div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />{" "}
                    <span>Add Doctor to Team</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <DoctorImageCard
            fileRef={fileInputRef}
            form={form}
            setForm={setForm}
            errors={{}}
          />

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
        </form>
      </div>

      <DoctorPreviewList doctorList={doctorList} />
    </div>
  );
};

export default AddDoctor;
