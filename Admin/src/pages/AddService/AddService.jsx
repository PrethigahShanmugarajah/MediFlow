// MediFlow / Admin / src / pages / AddService / AddService.jsx
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  buildDaysArray,
  clampDayToMonth,
  getAddSlotResult,
  getDaysInMonth,
  getRoundedTimeNow,
  validateServiceForm,
} from "../../utils/addServiceUtils";
import {
  createServiceApi,
  getServiceByIDApi,
  updateServiceApi,
} from "./Service/AddServiceService";
import ImageCard from "./Components/ImageCard";
import Instructions from "./Components/Instructions";
import ServiceDetails from "./Components/ServiceDetails";
import SlotControls from "./Components/SlotControls";
import AddServiceHeader from "./Components/AddServiceHeader";

const AddService = ({ serviceId }) => {
  const fileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [about, setAbout] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("available");
  const [instructions, setInstructions] = useState([""]);
  const [slots, setSlots] = useState([]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const [slotDay, setSlotDay] = useState(String(currentDate));
  const [slotMonth, setSlotMonth] = useState(String(currentMonth));
  const [slotYear, setSlotYear] = useState(String(currentYear));

  const [initialRounded] = useState(() => getRoundedTimeNow(5));

  const [slotHour, setSlotHour] = useState(initialRounded.hour);
  const [slotMinute, setSlotMinute] = useState(initialRounded.minute);
  const [slotAmPm, setSlotAmPm] = useState(initialRounded.ampm);
  const selectedYearNum = Number(slotYear);
  const selectedMonthNum = Number(slotMonth);
  const daysInSelectedMonth = getDaysInMonth(selectedYearNum, selectedMonthNum);
  const days = buildDaysArray(daysInSelectedMonth);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSlotDay((prev) => clampDayToMonth(prev, daysInSelectedMonth));
  }, [slotMonth, slotYear, daysInSelectedMonth]);

  useEffect(() => {
    if (serviceId) return;

    const isToday =
      Number(slotYear) === currentYear &&
      Number(slotMonth) === currentMonth &&
      Number(slotDay) === currentDate;

    if (!isToday) return;

    const t = getRoundedTimeNow(5);
    setSlotHour(t.hour);
    setSlotMinute(t.minute);
    setSlotAmPm(t.ampm);
  }, [
    serviceId,
    slotYear,
    slotMonth,
    slotDay,
    currentYear,
    currentMonth,
    currentDate,
  ]);

  useEffect(() => {
    let mounted = true;

    async function fetchServiceByIDService() {
      if (!serviceId) return;

      try {
        const formState = await getServiceByIDApi(serviceId);
        if (!mounted || !formState) return;

        setServiceName(formState.serviceName);
        setAbout(formState.about);
        setPrice(formState.price);
        setAvailability(formState.availability);
        setInstructions(formState.instructions);
        setSlots(formState.slots);
        setImagePreview(formState.imagePreview);
        setHasExistingImage(formState.hasExistingImage);
        setRemoveImage(formState.removeImage);
      } catch (error) {
        console.error("Fetch Service By ID error:", error);
      }
    }
    fetchServiceByIDService();
    return () => {
      mounted = false;
    };
  }, [serviceId]);

  function resetForm() {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {}
    }
    setImagePreview(null);
    setImageFile(null);
    setHasExistingImage(false);
    setRemoveImage(false);
    setServiceName("");
    setAbout("");
    setPrice("");
    setAvailability("available");
    setInstructions([""]);
    setSlots([]);
    setErrors({});
  }

  function addSlot() {
    const result = getAddSlotResult(slots, {
      slotDay,
      slotMonth,
      slotYear,
      slotHour,
      slotMinute,
      slotAmPm,
    });

    if (!result.ok) {
      if (result.reason === "DUPLICATE") {
        toast.error(
          "This time slot has already been added. Please choose a different time.",
        );
        return;
      }

      if (result.reason === "PAST") {
        toast.error(
          "You cannot add a time slot in the past. Please select a future date and time.",
        );
        setErrors((e) => ({ ...e, slots: true }));
        return;
      }
    }

    setSlots((s) => [...s, result.formatted]);
    setErrors((e) => ({ ...e, slots: false }));
    toast.success(`Time slot successfully added: ${result.formatted}.`);
  }

  function removeSlot(i) {
    const removedSlot = slots[i];
    setSlots((s) => s.filter((_, idx) => idx !== i));
    toast.info(`Time slot removed: ${removedSlot}.`);
  }

  function validate() {
    const newErrors = validateServiceForm({
      imageFile,
      hasExistingImage,
      serviceName,
      about,
      price,
      instructions,
      slots,
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error(
        "Please complete all required fields before submitting the form.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = serviceId
        ? await updateServiceApi(serviceId, {
            serviceName,
            about,
            price,
            availability,
            instructions,
            slots,
            imageFile,
            removeImage,
          })
        : await createServiceApi({
            serviceName,
            about,
            price,
            availability,
            instructions,
            slots,
            imageFile,
            removeImage,
          });

      const saved = payload?.data || null;

      if (!serviceId) {
        resetForm();
        if (fileRef.current) fileRef.current.value = null;
        return;
      }

      if (saved) {
        setHasExistingImage(Boolean(saved.imageUrl));
        setImagePreview(saved.imageUrl || null);
        setImageFile(null);
        setRemoveImage(false);
      }
    } catch (err) {
      console.error("Service submit error:", err);
      toast.error("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen font-serif from-indigo-100 via-white to-blue-100 relative flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-100/50 box-border"
      >
        <AddServiceHeader
          serviceId={serviceId}
          submitting={submitting}
          onReset={resetForm}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ImageCard
            fileRef={fileRef}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            imageFile={imageFile}
            setImageFile={setImageFile}
            hasExistingImage={hasExistingImage}
            setHasExistingImage={setHasExistingImage}
            removeImage={removeImage}
            setRemoveImage={setRemoveImage}
            errors={errors}
          />

          <div className="lg:col-span-2 md:col-span-1 col-span-1 space-y-6">
            <ServiceDetails
              serviceName={serviceName}
              setServiceName={setServiceName}
              price={price}
              setPrice={setPrice}
              availability={availability}
              setAvailability={setAvailability}
              about={about}
              setAbout={setAbout}
              errors={errors}
            />

            <Instructions
              instructions={instructions}
              setInstructions={setInstructions}
              errors={errors}
            />

            <SlotControls
              slots={slots}
              errors={errors}
              slotDay={slotDay}
              setSlotDay={setSlotDay}
              slotMonth={slotMonth}
              setSlotMonth={setSlotMonth}
              slotYear={slotYear}
              setSlotYear={setSlotYear}
              slotHour={slotHour}
              setSlotHour={setSlotHour}
              slotMinute={slotMinute}
              setSlotMinute={setSlotMinute}
              slotAmPm={slotAmPm}
              setSlotAmPm={setSlotAmPm}
              onAddSlot={addSlot}
              onRemoveSlot={removeSlot}
              currentYear={currentYear}
              currentMonth={currentMonth}
              currentDate={currentDate}
              days={days}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddService;
