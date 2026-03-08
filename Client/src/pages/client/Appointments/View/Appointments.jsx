import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  mapDoctorAppointment,
  mapServiceAppointment,
} from "../../../../utils/client/appointmentsUtils";
import {
  fetchDoctorAppointmentsByPatientApi,
  fetchServiceAppointmentsByPatientApi,
} from "../Service/AppointmentsService";
import ClientTitle from "../../../../components/client/ClientTitle";
import DetailPageLoader from "../../../../components/common/DetailPageLoader";
import ApiError from "../../../../components/common/ApiError";
import NotFoundState from "../../../../components/common/NotFoundState";
import AppointmentCard from "../Components/AppointmentCard";
import ShowMoreButton from "../../../../components/common/ShowMoreButton";
import {
  capitalizeWords,
  CURRENCY,
  formatDoctorName,
} from "../../../../utils/helpers";
import { NoImage, NoPersonImage } from "../../../../assets";
import SearchField from "../../../../components/common/SearchField";

const Appointments = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [doctorAppts, setDoctorAppts] = useState([]);
  const [serviceAppts, setServiceAppts] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAppointmentsByPatientService = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setLoadingDoctors(true);
    setError(null);
    try {
      const doctors = await fetchDoctorAppointmentsByPatientApi(getToken);
      setDoctorAppts(doctors);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load doctor appointments at this time. Please try again later.",
      );
      setDoctorAppts([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  const fetchServiceAppointmentsByPatientService = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setLoadingServices(true);
    setError(null);
    try {
      const services = await fetchServiceAppointmentsByPatientApi(getToken);
      setServiceAppts(services);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load service appointments at this time. Please try again later.",
      );
      setServiceAppts([]);
    } finally {
      setLoadingServices(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    fetchAppointmentsByPatientService();
    fetchServiceAppointmentsByPatientService();
  }, [
    fetchAppointmentsByPatientService,
    fetchServiceAppointmentsByPatientService,
  ]);

  const retry = () => {
    fetchAppointmentsByPatientService();
    fetchServiceAppointmentsByPatientService();
  };

  const appointmentData = useMemo(() => {
    return doctorAppts.map(mapDoctorAppointment);
  }, [doctorAppts]);

  const serviceData = useMemo(() => {
    return serviceAppts.map(mapServiceAppointment);
  }, [serviceAppts]);

  const allAppointments = useMemo(() => {
    const doctors = appointmentData.map((item) => ({
      ...item,
      type: "doctor",
    }));

    const services = serviceData.map((item) => ({
      ...item,
      type: "service",
    }));

    return [...doctors, ...services];
  }, [appointmentData, serviceData]);

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allAppointments;

    return allAppointments.filter((item) => {
      if (item.type === "doctor") {
        return (
          (item.doctor || "").toLowerCase().includes(q) ||
          (item.specialization || "").toLowerCase().includes(q)
        );
      }

      return (item.name || "").toLowerCase().includes(q);
    });
  }, [allAppointments, searchTerm]);

  const visibleAppointments = useMemo(() => {
    return showAll ? filteredAppointments : filteredAppointments.slice(0, 8);
  }, [filteredAppointments, showAll]);

  const isLoading = loadingDoctors || loadingServices;
  const hasAnyError = error;

  useEffect(() => {
    setShowAll(false);
  }, [searchTerm]);

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-blue-100 via-white to-indigo-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center justify-center mb-4">
          <ClientTitle
            title="All Your Appointments"
            description="View your doctor consultations and booked services together."
          />
        </div>

        {!error && (
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-xl px-2 sm:px-0">
              <SearchField
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search doctor or service..."
                size="l"
                widthClass=""
                showClear
                inputClassName=""
                className="rounded-full border border-indigo-300"
              />
            </div>
          </div>
        )}

        {isLoading && (
          <DetailPageLoader bgClass="bg-linear-to-br from-blue-50 via-white to-indigo-100" />
        )}

        <ApiError message={error} onRetry={retry} />

        {!isLoading && !hasAnyError && allAppointments.length === 0 && (
          <NotFoundState
            title="No appointments found"
            bgClass="bg-transparent"
            iconColor="text-indigo-500"
            backText={null}
            backTo={null}
            fullPage={false}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visibleAppointments.map((item) => (
            <AppointmentCard
              key={`${item.type}-${item.id}`}
              id={item.id}
              image={
                item.type === "doctor"
                  ? item.image || NoPersonImage
                  : item.image || NoImage
              }
              title={
                item.type === "doctor"
                  ? formatDoctorName(item.doctor)
                  : capitalizeWords(item.name)
              }
              specialization={
                item.type === "doctor"
                  ? `${capitalizeWords(item.specialization)}`
                  : undefined
              }
              experience={item.type === "doctor" ? item.experience : undefined}
              price={item.type === "service" ? item.price : undefined}
              currency={item.type === "service" ? CURRENCY : undefined}
              date={item.date}
              time={item.time}
              payment={item.payment}
              status={item.status}
              rescheduledTo={item.rescheduledTo}
              typeLabel={
                item.type === "doctor"
                  ? "Doctor Appointment"
                  : "Service Booking"
              }
            />
          ))}
        </div>

        <ShowMoreButton
          id="appointments-show-more"
          total={allAppointments.length}
          limit={8}
          showAll={showAll}
          onToggle={() => setShowAll((prev) => !prev)}
          moreText="Show More"
          lessText="Show Less"
          showRemainingCount
          showIcon
        />
      </div>
    </div>
  );
};

export default Appointments;
