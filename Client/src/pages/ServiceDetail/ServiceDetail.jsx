// MediFlow / Client / src / pages / ServiceDetail / ServiceDetail.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarCheck, Clock, UserX } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  getPrefillFromClerkUser,
  getScheduleDates,
  getSlotsForSelectedDate,
  sanitizeMobile10,
} from "../../utils/serviceDetailUtils";
import {
  bookServiceAppointmentApi,
  fetchServiceBookedSlotsApi,
  fetchServiceByIdApi,
} from "./Service/ServiceDetailService";
import DetailPageLoader from "../../components/DetailPageLoader";
import DetailErrorState from "../../components/DetailErrorState";
import NotFoundState from "../../components/NotFoundState";
import Header from "./Components/Header";
import ServiceProfile from "./Components/ServiceProfile";
import ServiceInformation from "./Components/ServiceInformation";
import DateSelector from "../../components/DateSelector";
import PatientDetailsForm from "../../components/PatientDetailsForm";
import { BeatLoader } from "react-spinners";
import TimeSlotSelector from "../../components/TimeSlotSelector";
import Summary from "./Components/Summary";

const ServiceDetail = () => {
  const { id } = useParams();

  const [service, setService] = useState(null);
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

  const fetchService = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const doc = await fetchServiceByIdApi(id);
      setService(doc);
    } catch (error) {
      setError(
        error?.message || "Unable to fetch service. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const retry = () => {
    fetchService();
  };

  const schedule = service?.slots || service?.schedule || null;

  const dates = useMemo(() => getScheduleDates(schedule), [schedule]);

  const fee = Number(service?.price ?? service?.fee ?? service?.fees ?? 0);

  const slots = useMemo(
    () => getSlotsForSelectedDate(schedule, selectedDate),
    [schedule, selectedDate],
  );

  useEffect(() => {
    const serviceId = service?._id || service?.id;
    if (!serviceId || !selectedDate) return;

    const dateISO = selectedDate.toISOString().split("T")[0];

    let mounted = true;
    setBookedLoading(true);
    setBookedSlots([]);
    setSelectedSlot("");

    (async () => {
      try {
        const booked = await fetchServiceBookedSlotsApi(serviceId, dateISO);
        if (!mounted) return;
        setBookedSlots(booked || []);
      } catch (e) {
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
  }, [service?._id, service?.id, selectedDate]);

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

    try {
      await bookServiceAppointmentApi({
        service,
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

  if (loading)
    return (
      <DetailPageLoader bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100" />
    );

  if (error)
    return (
      <DetailErrorState
        message={error}
        onRetry={retry}
        backTo="/services"
        backText="Back to Services"
        bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100"
      />
    );

  if (!service)
    return (
      <NotFoundState
        icon={UserX}
        title="Service Not Found"
        backText="Back to Services"
        backTo="/services"
        bgClass="bg-linear-to-br from-blue-100 via-white to-indigo-100"
      />
    );

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-blue-100 via-white to-indigo-100 relative overflow-hidden">
      <Header backTo="/services" />

      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* -------- Profile Card -------- */}
        <div className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 sm:p-8">
            <ServiceProfile service={service} />
            <ServiceInformation service={service} fee={fee} />
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
                  dates={dates}
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
                  service={service}
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

export default ServiceDetail;
