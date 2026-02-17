// MediFlow / Admin / src / components / AddPage / AddPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FileInputField,
  InputField,
  SelectInput,
  TextAreaField,
} from "../FormField/FormField";
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import { toast } from "react-toastify";
import {
  Calendar,
  Eye,
  EyeOff,
  Plus,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { formatDateISO, timeStringToMinutes } from "./Services";

const AddPage = () => {
  const [doctorList, setDoctorList] = useState([]);

  const { control, setValue, watch, getValues } = useForm({
    defaultValues: {
      doctorImage: null,
      name: "",
      specialization: "",
      location: "",
      experience: "",
      qualifications: "",
      fee: "",
      rating: "",
      patients: "",
      success: "",
      email: "",
      password: "",
      availability: "Available",
      about: "",
      slotDate: "",

      slotHour: "",
      slotMinute: "00",
      slotAmpm: "AM",
    },
  });

  const imageFiles = watch("doctorImage");
  const selectedFile = imageFiles?.[0] || null;

  const [form, setForm] = useState({
    schedule: {},
  });

  const [slotDate, setSlotDate] = useState("");
  const [slotHour, setSlotHour] = useState("");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotAmpm, setSlotAmpm] = useState("AM");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [today] = useState(() => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().split("T")[0];
  });

  const hourOptions = Array.from({ length: 12 }).map((_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const minuteOptions = Array.from({ length: 60 }).map((_, i) => {
    const v = String(i).padStart(2, "0");
    return { value: v, label: v };
  });

  function addSlotToForm() {
    if (!slotDate || !slotHour) {
      toast.warn("Select date + time");
      return;
    }
    if (slotDate < today) {
      toast.warn("Cannot add a slot in the past");
      return;
    }
    const time = `${slotHour}:${slotMinute} ${slotAmpm}`;

    if (slotDate === today) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = timeStringToMinutes(time);
      if (slotMinutes <= nowMinutes) {
        toast.warn("Cannot add a time that has already passed today");
        return;
      }
    }

    setForm((f) => {
      const sched = { ...f.schedule };
      if (!sched[slotDate]) sched[slotDate] = [];
      if (!sched[slotDate].includes(time)) sched[slotDate].push(time);

      sched[slotDate] = sched[slotDate].sort(
        (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b),
      );
      return { ...f, schedule: sched };
    });

    setSlotHour("");
    setSlotMinute("00");
    setSlotAmpm("AM");

    setValue("slotHour", "");
    setValue("slotMinute", "00");
    setValue("slotAmpm", "AM");
  }

  function removeSlot(date, time) {
    setForm((f) => {
      const sched = { ...f.schedule };
      sched[date] = sched[date].filter((t) => t !== time);
      if (!sched[date].length) delete sched[date];
      return { ...f, schedule: sched };
    });
  }

  function getFlatSlots(s) {
    const arr = [];
    Object.keys(s)
      .sort()
      .forEach((d) => {
        s[d].forEach((t) => arr.push({ date: d, time: t }));
      });
    return arr;
  }

  function validate() {
    const v = getValues();

    const req = [
      "name",
      "specialization",
      "experience",
      "qualifications",
      "location",
      "about",
      "fee",
      "success",
      "patients",
      "rating",
      "email",
      "password",
    ];

    for (let k of req) if (!v[k]) return false;

    const img = watch("doctorImage")?.[0];
    if (!img) return false;

    if (!Object.keys(form.schedule).length) return false;

    return true;
  }

  async function handleAdd(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Fill all fields + upload image + add slot");
      return;
    }

    const v = getValues();

    const r = Number(v.rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      toast.error("Rating must be a number between 1 and 5");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("name", v.name);
      fd.append("specialization", v.specialization || "");
      fd.append("experience", v.experience || "");
      fd.append("qualifications", v.qualifications || "");
      fd.append("location", v.location || "");
      fd.append("about", v.about || "");
      fd.append("fee", v.fee === "" ? "0" : String(v.fee));
      fd.append("success", v.success || "");
      fd.append("patients", v.patients || "");
      fd.append("rating", v.rating === "" ? "0" : String(v.rating));
      fd.append("availability", v.availability || "Available");
      fd.append("email", v.email);
      fd.append("password", v.password);

      fd.append("schedule", JSON.stringify(form.schedule || {}));

      const img = watch("doctorImage")?.[0];
      if (img) fd.append("image", img);

      const response = await api.post(API_ROUTES.DOCTORS.DOCTORS_CREATE, fd);

      console.log("Add Doctor API Response:", response);

      const data = response.data;

      if (data?.success) {
        toast.success(data?.message || "Doctor Added Successfully!");
        console.log("Add Doctor Success:", data?.message);

        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        const doctorFromServer = data?.data
          ? data.data
          : { id: Date.now(), ...v };

        setDoctorList((old) => [doctorFromServer, ...old]);

        setForm({ schedule: {} });
        setValue("doctorImage", null);
        setValue("name", "");
        setValue("specialization", "");
        setValue("location", "");
        setValue("experience", "");
        setValue("qualifications", "");
        setValue("fee", "");
        setValue("rating", "");
        setValue("patients", "");
        setValue("success", "");
        setValue("email", "");
        setValue("password", "");
        setValue("availability", "Available");
        setValue("about", "");
        setValue("slotDate", "");
        setValue("slotHour", null);
        setValue("slotMinute", { value: "00", label: "00" });
        setValue("slotAmpm", { value: "AM", label: "AM" });
        setSlotDate("");
        setSlotHour("");
        setSlotMinute("00");
        setSlotAmpm("AM");
        setShowPassword(false);
      } else {
        toast.warn(data?.message || "Doctor added with warning");
        console.warn("Add Doctor Warning:", data?.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add doctor",
      );
      console.log("Add Doctor Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h- font-serif bg-linear-to-br from-indigo-50 via-white to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-500 rounded-full shadow-lg">
            <Stethoscope className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent mt-2 sm:mt-0">
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
            <FileInputField
              control={control}
              label="Upload Profile Image"
              name="doctorImage"
              rules={{ required: "Profile image is required" }}
              accept="image/*"
            />

            {selectedFile && (
              <div className="relative inline-block mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setValue("doctorImage", null);
                  }}
                  className="absolute -top-25 -right-68 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <InputField
            control={control}
            name="name"
            placeholder="Full Name"
            rules={{ required: "Full name is required" }}
          />

          <InputField
            control={control}
            name="specialization"
            placeholder="Specialization"
            rules={{ required: "Specialization is required" }}
          />

          <InputField
            control={control}
            name="location"
            placeholder="Location"
            rules={{ required: "Location is required" }}
          />

          <InputField
            control={control}
            name="experience"
            placeholder="Experience"
            rules={{ required: "Experience is required" }}
          />

          <InputField
            control={control}
            name="qualifications"
            placeholder="Qualifications"
            rules={{ required: "Qualifications is required" }}
          />

          <InputField
            control={control}
            name="fee"
            placeholder="Consultation Fee"
            type="number"
            rules={{ required: "Fee is required" }}
          />

          <InputField
            control={control}
            name="rating"
            type="number"
            placeholder="Rating (1.0 - 5.0)"
            rules={{
              required: "Rating is required",
              validate: (v) => {
                const n = Number(v);
                if (Number.isNaN(n)) return "Rating must be a number";
                if (n < 1 || n > 5) return "Rating must be between 1 and 5";
                return true;
              },
            }}
            min={1}
            max={5}
            step={0.1}
            onChange={(e) => {
              const v = e.target.value;

              if (v === "") {
                setValue("rating", "");
                return;
              }

              const n = Number(v);
              if (Number.isNaN(n)) return;

              const clamped = Math.max(1, Math.min(5, n));
              const fixed = Math.round(clamped * 10) / 10;

              setValue("rating", fixed.toString(), { shouldValidate: true });
            }}
            onBlur={() => {
              const v = String(watch("rating") ?? "");
              if (!v) return;

              const n = Number(v);
              if (Number.isNaN(n)) {
                setValue("rating", "");
                return;
              }

              const clamped = Math.max(1, Math.min(5, n));
              const finalValue = clamped.toFixed(1);

              setValue("rating", finalValue, { shouldValidate: true });
            }}
          />

          <InputField
            control={control}
            name="patients"
            placeholder="Patients"
            type="number"
            rules={{ required: "Patients count is required" }}
          />

          <InputField
            control={control}
            name="success"
            placeholder="Success Rate"
            type="number"
            rules={{ required: "Success rate is required" }}
          />

          <InputField
            control={control}
            name="email"
            type="email"
            placeholder="Doctor Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            }}
          />

          <div className="relative">
            <InputField
              control={control}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Doctor Password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              }}
              inputClassName="pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <SelectInput
            control={control}
            label=""
            name="availability"
            placeholder="Availability"
            rules={{ required: "Availability is required" }}
            options={[
              { value: "Available", label: "Available" },
              { value: "Unavailable", label: "Unavailable" },
            ]}
          />

          <TextAreaField
            control={control}
            name="about"
            placeholder="About Doctor"
            rules={{ required: "About Doctor is required" }}
            rows={4}
            className="md:col-span-2"
          />

          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-indigo-600" />
              <p className="text-lg font-semibold text-indigo-800">
                Add Schedule Slots
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <InputField
                control={control}
                name="slotDate"
                type="date"
                rules={{ required: "Date required" }}
                inputClassName="w-full sm:w-40"
                min={today}
                onChange={(e) => {
                  setValue("slotDate", e.target.value);
                  setSlotDate(e.target.value);
                }}
              />

              <SelectInput
                control={control}
                name="slotHour"
                label=""
                placeholder="Hour"
                options={hourOptions}
                className="w-full sm:w-40"
                selectClassName="w-full"
                onChange={(opt) => {
                  const value = opt?.value || "";
                  setValue("slotHour", value);
                  setSlotHour(value);
                }}
              />

              <SelectInput
                control={control}
                name="slotMinute"
                placeholder="Min"
                options={minuteOptions}
                className="w-full sm:w-40"
                selectClassName="w-full"
                onChange={(opt) => {
                  const value = opt?.value || "00";
                  setValue("slotMinute", value);
                  setSlotMinute(value);
                }}
              />

              <SelectInput
                control={control}
                name="slotAmpm"
                placeholder="AM/PM"
                options={[
                  { value: "AM", label: "AM" },
                  { value: "PM", label: "PM" },
                ]}
                className="w-full sm:w-40"
                selectClassName="w-full"
                onChange={(opt) => {
                  const value = opt?.value || "AM";
                  setValue("slotAmpm", value);
                  setSlotAmpm(value);
                }}
              />

              <button
                type="button"
                onClick={addSlotToForm}
                className="px-5 py-3 bg-indigo-500 text-white rounded-full flex items-center gap-2 w-full sm:w-40 justify-center"
              >
                <Plus size={18} /> Add Slot
              </button>
            </div>

            <div className="mt-4 space-y-2 max-w-9xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFlatSlots(form.schedule).map(({ date, time }) => (
                <div
                  key={date + time}
                  className="flex justify-between items-center bg-indigo-50 p-3 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md text-indigo-800 cursor-pointer"
                >
                  <span>
                    {formatDateISO(date)} — {time}
                  </span>
                  <button
                    onClick={() => removeSlot(date, time)}
                    className="text-red-500"
                    aria-label={`Remove slot ${date} ${time}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 rounded-full font-semibold shadow-xl w-full md:w-auto ${loading ? "opacity-60 cursor-not-allowed" : "bg-linear-to-r from-indigo-500 to-sky-500 text-white"}`}
            >
              {loading ? (
                <>
                  <div className="flex items-center justify-center gap-3">
                    <ClipLoader size={18} color="#3B82F6" />
                    <span className="text-sm animate-pulse">Adding...</span>
                  </div>
                </>
              ) : (
                "Add Doctor to Team"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        {doctorList.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorList.map((d) => (
              <div
                key={d.id || d._id}
                className="p-4 rounded-xl border border-gray-200 bg-white/80 shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={d.imageUrl || d.imagePreview}
                    alt={d.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-sm text-gray-500">
                      {d.specialization}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No Doctor Yet</p>
        )}
      </div>
    </div>
  );
};

export default AddPage;
