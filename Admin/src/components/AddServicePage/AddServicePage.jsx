// MediFlow / Admin / src / components / AddServicePage / AddServicePage.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Calendar,
  CheckCircle,
  Clock,
  Image,
  Plus,
  Trash2,
} from "lucide-react";
import "./AddServicePage.css";
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import { toast } from "react-toastify";
import { fetchServiceById } from "../../services/fetch";
import {
  CheckboxField,
  FileInputField,
  InputField,
  SelectInput,
  TextAreaField,
} from "../FormField/FormField";
import { ClipLoader } from "react-spinners";
import {
  buildAmPmOptions,
  buildDayOptions,
  buildHourOptions,
  buildMinuteOptions,
  buildMonthOptions,
  buildYearOptions,
  getDefaultSlotValues,
  MONTHS,
  tryAddSlot,
  validateServiceForm,
} from "./Services";

const AddServicePage = ({ serviceId }) => {
  const fileRef = useRef(null);

  const defaults = getDefaultSlotValues();

  const currentDay = defaults.slotDay;
  const currentMonth = defaults.slotMonth;
  const currentYear = defaults.slotYear;
  const currentHour = defaults.slotHour;
  const currentMinute = defaults.slotMinute;
  const currentAmPm = defaults.slotAmPm;

  const now = new Date();

  const { control, watch, setValue } = useForm({
    defaultValues: {
      serviceImage: null,
      name: "",
      price: "",
      about: "",
      availability: "available",
      slotDay: currentDay,
      slotMonth: currentMonth,
      slotYear: currentYear,
      slotHour: currentHour,
      slotMinute: currentMinute,
      slotAmPm: currentAmPm,
      removeImage: false,
      instructions: [""],
    },
  });

  const selectedFile = watch("serviceImage")?.[0] || null;
  const serviceName = watch("name") || "";
  const price = watch("price") || "";
  const about = watch("about") || "";
  const availability = watch("availability") || "available";
  const removeImage = watch("removeImage") || false;

  const [imagePreview, setImagePreview] = useState(null);

  const selectedPreview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : null;

  useEffect(() => {
    return () => {
      if (selectedPreview) URL.revokeObjectURL(selectedPreview);
    };
  }, [selectedPreview]);

  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [instructions, setInstructions] = useState([""]);
  const [slots, setSlots] = useState([]);

  const yearOptions = buildYearOptions({
    baseYear: now.getFullYear(),
    count: 5,
  });

  const [slotDay, setSlotDay] = useState(currentDay);
  const [slotMonth, setSlotMonth] = useState(currentMonth);
  const [slotYear, setSlotYear] = useState(currentYear);
  const [slotHour, setSlotHour] = useState(currentHour);
  const [slotMinute, setSlotMinute] = useState(currentMinute);
  const [slotAmPm, setSlotAmPm] = useState(currentAmPm);

  const months = MONTHS;

  const monthOptions = buildMonthOptions({
    months,
    slotYear,
    currentYear,
    currentMonth,
  });

  const hourOptions = buildHourOptions();

  const minuteOptions = buildMinuteOptions(5);

  const ampmOptions = buildAmPmOptions();

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const dayOptions = buildDayOptions({
    slotYear,
    slotMonth,
    currentYear,
    currentMonth,
    currentDay,
  });

  useEffect(() => {
    let mounted = true;

    async function loadService() {
      if (!serviceId) return;

      try {
        const data1 = await fetchServiceById(serviceId);
        if (!data1?.success) return;

        const data = data1?.data || data1;
        if (!data) return;
        if (!mounted) return;

        setValue("name", data.name || "");
        setValue("about", data.about || data.description || "");
        setValue("price", data.price != null ? String(data.price) : "");
        setValue("availability", data.available ? "available" : "unavailable");

        setInstructions(
          Array.isArray(data.instructions) && data.instructions.length
            ? data.instructions
            : [""],
        );
        setSlots(Array.isArray(data.slots) ? data.slots : []);

        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
          setValue("serviceImage", null);
          setHasExistingImage(true);
          setValue("removeImage", false);
        } else {
          setImagePreview(null);
          setHasExistingImage(false);
        }
      } catch (error1) {
        console.error("loadService error:", error1);
      }
    }

    loadService();
    return () => {
      mounted = false;
    };
  }, [serviceId]);

  function addInstruction() {
    setInstructions((s) => [...s, ""]);
  }

  function updateInstruction(i, v) {
    setInstructions((s) => s.map((x, idx) => (idx === i ? v : x)));
  }

  function removeInstruction(i) {
    setInstructions((s) => s.filter((_, idx) => idx !== i));
  }

  function resetForm() {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {}
    }

    const defaults = getDefaultSlotValues();

    setImagePreview(null);
    setHasExistingImage(false);

    setValue("removeImage", false);
    setValue("serviceImage", null);

    setInstructions([""]);
    setValue("instructions", [""]);

    setSlots([]);
    setErrors({});

    setValue("name", "");
    setValue("about", "");
    setValue("price", "");
    setValue("availability", "available");

    setValue("slotDay", defaults.slotDay);
    setValue("slotMonth", defaults.slotMonth);
    setValue("slotYear", defaults.slotYear);
    setValue("slotHour", defaults.slotHour);
    setValue("slotMinute", defaults.slotMinute);
    setValue("slotAmPm", defaults.slotAmPm);

    setSlotDay(defaults.slotDay);
    setSlotMonth(defaults.slotMonth);
    setSlotYear(defaults.slotYear);
    setSlotHour(defaults.slotHour);
    setSlotMinute(defaults.slotMinute);
    setSlotAmPm(defaults.slotAmPm);
  }

  function validate() {
    const instructionValues = watch("instructions") || [];

    const { isValid, errors: newErrors } = validateServiceForm({
      selectedFile,
      hasExistingImage,
      serviceName,
      about,
      price,
      instructionValues,
      slots,
    });

    setErrors(newErrors);
    return isValid;
  }

  function addSlot() {
    const result = tryAddSlot({
      slots,
      months,
      slotValues: {
        slotDay,
        slotMonth,
        slotYear,
        slotHour,
        slotMinute,
        slotAmPm,
      },
    });

    if (!result.ok) {
      if (result.error === "DUPLICATE") {
        toast.error(
          "This time slot has already been added. Please select a different time.",
        );
        return;
      }

      if (result.error === "PAST") {
        toast.error(
          "You cannot add a time slot in the past. Please select a future date/time.",
        );
        setErrors((e) => ({ ...e, slots: true }));
        return;
      }

      toast.error("Invalid time slot.");
      return;
    }

    setSlots(result.slots);
    setErrors((e) => ({ ...e, slots: false }));
    toast.success(`Time slot added: ${result.label}`);
  }

  function removeSlot(i) {
    const removedSlot = slots[i];
    setSlots((s) => s.filter((_, idx) => idx !== i));
    toast.info(`Removed: ${removedSlot}`);
  }

  function validate() {
    console.log({
      selectedFile,
      hasExistingImage,
      serviceName,
      about,
      price,
      instructionValues: watch("instructions"),
      slots,
    });

    const newErrors = {};
    const instructionValues = watch("instructions") || [];
    if (!selectedFile && !hasExistingImage) newErrors.image = true;
    if (!serviceName.trim()) newErrors.serviceName = true;
    if (!about.trim()) newErrors.about = true;
    if (!String(price).trim()) newErrors.price = true;
    if (!instructionValues.some((v) => String(v || "").trim()))
      newErrors.instructions = true;
    if (!slots.length) newErrors.slots = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields before submitting.");
      console.error("Please fill all required fields before submitting.");

      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", serviceName);
      fd.append("about", about);
      const numericPrice = String(price).replace(/[^\d.-]/g, "");
      fd.append("price", numericPrice === "" ? "0" : numericPrice);
      fd.append("availability", availability);

      const instructionValues = watch("instructions") || [""];
      fd.append("instructions", JSON.stringify(instructionValues));
      fd.append("slots", JSON.stringify(slots));

      if (selectedFile) {
        fd.append("image", selectedFile);
      } else if (removeImage) {
        fd.append("removeImage", "true");
      }

      const endpoint = serviceId
        ? API_ROUTES.SERVICE.SERVICE_UPDATE(serviceId)
        : API_ROUTES.SERVICE.SERVICE_CREATE;

      const response = serviceId
        ? await api.put(endpoint, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post(endpoint, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      const action = serviceId ? "Updated" : "Added";

      console.log(`${action} Service API Response:`, response);

      const data = response.data;

      if (data?.success) {
        const action = serviceId ? "Updated" : "Added";

        toast.success(data?.message);
        console.log(`${action} service Success:`, data?.message);

        if (!serviceId) {
          resetForm();
          if (fileRef.current) fileRef.current.value = null;
        } else {
          const saved = data?.data || null;
          if (saved) {
            setHasExistingImage(Boolean(saved.imageUrl));
            setImagePreview(saved.imageUrl || null);
            setImageFile(null);
            setValue("removeImage", false);
          }
        }
      } else {
        const action = serviceId ? "Updated" : "Added";

        toast.warn(data?.message || `${action} service completed with warning`);
        console.warn(`${action} service Warning:`, data?.message);

        setSubmitting(false);
        return;
      }
    } catch (error) {
      const action = serviceId ? "Updated" : "Added";

      toast.error(error?.response?.data?.message || error?.message);
      console.error(
        `${action} service Error:`,
        error?.response?.data?.message || error?.message,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-indigo-50 via-indigo-100 to-fuchsia-50 relative flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-100/50 box-border"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-linear-to-r from-indigo-700 to-fuchsia-600 bg-clip-text">
              {serviceId ? "Edit Service" : "Add Service"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Create a beautiful service card with unique time slots
            </p>
          </div>

          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-4 py-2 cursor-pointer rounded-full bg-white border border-indigo-100 hover:shadow transition-shadow duration-200"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center items-center gap-2 w-full sm:w-auto px-5 py-2 rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500 text-white font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="col-span-full flex text-center items-center justify-center  text-white gap-3">
                    <ClipLoader size={18} color="#FFFFFF" />
                    <span className="text-sm animate-pulse">Saving...</span>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {serviceId ? "Update Service" : "Save Service"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* -------- Left Side -------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 md:col-span-1 col-span-1 flex flex-col items-center">
            <div
              className={`w-full rounded-2xl p-4 shadow-inner flex flex-col items-center gap-4 ${
                errors.image
                  ? "border-2 border-rose-200 bg-linear-to-b from-rose-50 to-orange-50"
                  : "bg-linear-to-b from-indigo-50 to-fuchsia-50 border border-indigo-100"
              }`}
            >
              <div className="w-full h-56 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-indigo-100">
                {selectedPreview ? (
                  <img
                    src={selectedPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Existing"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-indigo-400">
                    <Image className="w-10 h-10" />
                    <div className="mt-2 text-sm">
                      Service image{" "}
                      <span className="text-sm text-red-500">*</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full flex gap-2 items-center">
                <FileInputField
                  control={control}
                  name="serviceImage"
                  label=""
                  rules={{ required: false }}
                  accept="image/*"
                  trigger={true}
                  TriggerIcon={Plus}
                  triggerText={
                    selectedFile || (imagePreview && hasExistingImage)
                      ? "Replace Image"
                      : "Upload Image"
                  }
                  triggerClassName="flex-1"
                />

                {(selectedFile || hasExistingImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("serviceImage", null);

                      if (hasExistingImage) {
                        setValue("removeImage", true);
                        setHasExistingImage(false);
                      }

                      setImagePreview(null);
                    }}
                    className="px-3 py-2 rounded-full bg-white border border-rose-100 hover:shadow transition-shadow"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                )}
              </div>

              {hasExistingImage && (
                <div className="w-full text-xs text-gray-600 mt-2 flex items-center gap-2">
                  <CheckboxField
                    control={control}
                    name="removeImage"
                    label="Remove existing image"
                    labelPosition="bottom"
                    className="w-full text-xs text-gray-600 mt-2"
                    onChange={(e) => {
                      const checked = e.target.checked;

                      if (checked) {
                        setImagePreview(null);
                        setImageFile(null);
                        setHasExistingImage(false);
                      }
                    }}
                  />
                  {/* <label htmlFor="remove-img">Remove existing image</label> */}
                </div>
              )}
            </div>
          </div>

          {/* -------- Right Side -------- */}
          <div className="lg:col-span-2 md:col-span-1 col-span-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputField
                  control={control}
                  label="Service name"
                  name="name"
                  placeholder="e.g. General Consultation"
                  rules={{ required: "Service name is required" }}
                  inputClassName={`mt-2 px-4 py-3 shadow-md transition-all ${
                    errors.serviceName ? "border-2 border-rose-200" : ""
                  }`}
                />
              </div>

              <div>
                <InputField
                  control={control}
                  label="Price"
                  name="price"
                  placeholder="LKR 499"
                  rules={{ required: "Price is required" }}
                  inputMode="numeric"
                  inputClassName={`mt-2 px-4 py-3 shadow-md transition-all ${
                    errors.price ? "border-2 border-rose-200" : ""
                  }`}
                />

                <div className="mt-3">
                  <SelectInput
                    control={control}
                    label="Availability"
                    name="availability"
                    rules={{ required: "Availability is required" }}
                    options={[
                      { value: "available", label: "Available" },
                      { value: "unavailable", label: "Unavailable" },
                    ]}
                    placeholder="Select availability"
                    selectClassName="mt-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <TextAreaField
                control={control}
                label="About this service"
                name="about"
                placeholder="Short description"
                rows={4}
                rules={{ required: "About is required" }}
                textareaClassName={`mt-2 px-4 py-3 rounded-2xl shadow-md ${
                  errors.about
                    ? "border border-rose-200"
                    : "border border-indigo-100 focus:ring-indigo-200"
                }`}
              />
            </div>
          </div>

          <div className="lg:col-span-3 md:col-span-2 col-span-1 space-y-6">
            {/* -------- Instructions -------- */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-indigo-700">
                  Instructions (point wise)
                </label>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div
                className={`mt-3 space-y-2 max-h-44 overflow-auto pr-2 ${
                  errors.instructions
                    ? "ring-2 ring-rose-100 rounded-xl p-2"
                    : ""
                }`}
              >
                {instructions.map((ins, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 my-2 bg-gray-50 px-5 py-4 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="font-semibold text-indigo-600 text-sm">
                      {idx + 1}.
                    </div>

                    <InputField
                      control={control}
                      name={`instructions.${idx}`}
                      type="text"
                      placeholder={`Instruction ${idx + 1}`}
                      unstyled={true}
                      inputClassName=""
                    />

                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(idx)}
                        className="ml-auto p-2 rounded-full hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* -------- Slot Controls -------- */}
            <div
              className={`bg-linear-to-br from-white to-indigo-50 rounded-2xl p-4 ${
                errors.slots
                  ? "border-2 border-rose-200"
                  : "border border-indigo-50"
              } shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-700 font-medium">
                  <Calendar className="w-5 h-5" /> Slots & Schedule
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    {slots.length} slot{slots.length !== 1 ? "s" : ""} added
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                  <div className="min-w-0">
                    <SelectInput
                      control={control}
                      label="Day"
                      name="slotDay"
                      rules={{ required: "Day is required" }}
                      options={dayOptions}
                      placeholder="Day"
                      className="w-full"
                      selectClassName="mt-1"
                      onChange={(opt) => setSlotDay(opt?.value || "")}
                    />
                  </div>

                  <div className="min-w-0">
                    <SelectInput
                      control={control}
                      label="Month"
                      name="slotMonth"
                      rules={{ required: "Month is required" }}
                      options={monthOptions}
                      placeholder="Month"
                      className="w-full"
                      selectClassName="mt-1"
                      onChange={(opt) => setSlotMonth(opt?.value || "")}
                    />
                  </div>

                  <div className="min-w-0">
                    <SelectInput
                      control={control}
                      label="Year"
                      name="slotYear"
                      rules={{ required: "Year is required" }}
                      options={yearOptions}
                      placeholder="Year"
                      className="w-full"
                      selectClassName="mt-1"
                      onChange={(opt) => setSlotYear(opt?.value || "")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                  <div className="min-w-0">
                    <SelectInput
                      control={control}
                      label="Hour"
                      name="slotHour"
                      rules={{ required: "Hour required" }}
                      options={hourOptions}
                      placeholder="Hour"
                      selectClassName="mt-1"
                      onChange={(opt) => setSlotHour(opt?.value || "")}
                    />
                  </div>

                  <div className="min-w-0">
                    <SelectInput
                      control={control}
                      label="Minute"
                      name="slotMinute"
                      rules={{ required: "Minute required" }}
                      options={minuteOptions}
                      placeholder="Minute"
                      selectClassName="mt-1"
                      onChange={(opt) => setSlotMinute(opt?.value || "00")}
                    />
                  </div>

                  <div className="min-w-0">
                    <SelectInput
                      control={control}
                      label="AM/PM"
                      name="slotAmPm"
                      rules={{ required: "AM/PM required" }}
                      options={ampmOptions}
                      placeholder="AM/PM"
                      selectClassName="mt-1"
                      onChange={(opt) => setSlotAmPm(opt?.value || "AM")}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={addSlot}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500 text-white font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" /> Add This Time Slot
                </button>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">
                  Added Slots ({slots.length})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 overflow-auto gap-2 max-h-screen pr-2 justify-items-start">
                  {slots.length === 0 ? (
                    <div className="text-sm text-gray-400 italic px-4 py-2">
                      No slots added yet. Select a time and click "Add This Time
                      Slot"
                    </div>
                  ) : (
                    slots.map((s, idx) => (
                      <div
                        key={s}
                        className="inline-flex w-fit items-center gap-2 bg-linear-to-r from-indigo-50 to-fuchsia-50 border border-indigo-100 px-2 py-2 my-1 rounded-full shadow hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-4 h-4 xl:w-6 xl:h-6 text-indigo-600" />
                          <div className="text-xs whitespace-nowrap font-medium">
                            {s}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSlot(idx)}
                          className="p-1 rounded-full xl:-mr-1 hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddServicePage;
