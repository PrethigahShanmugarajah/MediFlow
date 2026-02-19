// MediFlow / Admin / src / components / ServiceAppointmentsPage / ServiceAppointmentsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Banknote,
  Calendar,
  Clock,
  Phone,
  SearchIcon,
  User,
  XIcon,
} from "lucide-react";
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import { toast } from "react-toastify";
import StatusBadge from "./components/StatusBadge";
import StatusSelect from "./components/StatusSelect";
import RescheduleButton from "./components/RescheduleButton";
import {
  formatDateNice,
  formatTimeDisplay,
  formatTwo,
  parseTimeToParts,
  statusOptions,
} from "./Services";
import { fetchServiceAppointment } from "../../services/fetch";
import { InputField, SelectInput } from "../FormField/FormField";
import { ClipLoader } from "react-spinners";
import "./ServiceAppointmentsPage.css";
import DeletePopup from "../DeletePopup/DeletePopup";

const ServiceAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { control, setValue } = useForm({
    defaultValues: { search: "", statusFilter: "" },
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 220);
    return () => clearTimeout(t);
  }, [search]);

  const [statusFilter, setStatusFilter] = useState("");

  async function loadServiceAppointments() {
    setLoading(true);
    setError(null);

    try {
      const data1 = await fetchServiceAppointment({ limit: 500 });

      if (!data1?.success) {
        throw new Error(data1?.message || "Failed to fetch appointments");
      }

      const list = Array.isArray(data1.appointments)
        ? data1.appointments
        : (data1.appointments ?? data1.items ?? data1.data ?? []);

      const normalized = (Array.isArray(list) ? list : [])
        .map((a) => {
          const timeStr =
            a.time ||
            (a.slot && a.slot.time) ||
            (a.hour !== undefined && a.minute !== undefined
              ? `${formatTwo(a.hour || 12)}:${formatTwo(a.minute ?? 0)} ${
                  a.ampm || "AM"
                }`
              : "") ||
            a.rescheduledTo?.time ||
            "";

          const parsed = parseTimeToParts(timeStr);

          return {
            id: a._id || a.id,
            patientName:
              a.patientName || a.name || a.raw?.patientName || "Unknown",
            gender: a.gender || a.raw?.gender || "",
            mobile: a.mobile || a.phone || "",
            age: a.age || a.raw?.age || "",
            serviceName:
              a.serviceName ||
              a.service ||
              a.raw?.serviceName ||
              (a.notes || "").slice(0, 40),
            fees: a.fees ?? a.fee ?? a.payment?.amount ?? 0,
            date: a.date || a.slot?.date || a.rescheduledTo?.date || "",
            hour: parsed.hour,
            minute: parsed.minute,
            ampm: parsed.ampm,
            status: a.status || a.payment?.status || "Pending",
            raw: a,
          };
        })
        .filter(Boolean);

      setAppointments(normalized);
    } catch (error1) {
      setError(error1?.message || "Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServiceAppointments();
  }, []);

  function extractUpdated(body) {
    return body?.data || body?.appointment || body || {};
  }

  async function changeStatusRemote(id, newStatus) {
    const old = appointments.find((a) => a.id === id);
    if (!old) return;

    if (old.status === "Completed" || old.status === "Canceled") {
      toast.warn(`Appointment #${id} is already ${old.status}.`);
      console.warn(`Appointment #${id} already ${old.status}`);
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );

    toast.info(`Appointment #${id} is being updated to ${newStatus}`);
    console.log(`Updating appointment #${id} to ${newStatus}`);

    try {
      const response2 = await api.put(
        API_ROUTES.SERVICEAPPOINTMENT.SERVICEAPPOINTMENTS_UPDATE(id),
        { status: newStatus },
      );

      console.log("Update Service Appointment API Response:", response2);

      const data2 = response2.data;

      if (data2?.success) {
        toast.success(
          data2?.message ||
            `Status updated to ${newStatus} for appointment #${id}`,
        );
        console.log("Update Service Appointment Success:", data2?.message);

        const updated = data2?.data || data2?.appointment || {};

        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: updated.status || newStatus,
                  date: updated.date || updated.rescheduledTo?.date || a.date,
                  hour: parseTimeToParts(
                    updated.time ||
                      updated.rescheduledTo?.time ||
                      `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`,
                  ).hour,
                  minute: parseTimeToParts(
                    updated.time ||
                      updated.rescheduledTo?.time ||
                      `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`,
                  ).minute,
                  ampm: parseTimeToParts(
                    updated.time ||
                      updated.rescheduledTo?.time ||
                      `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`,
                  ).ampm,
                  raw: updated || a.raw,
                }
              : a,
          ),
        );
      } else {
        toast.warn(data2?.message || "Update Service Appointment with warning");
        console.warn("Update Service Appointment Warning:", data2?.message);

        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: old.status } : a)),
        );
      }
    } catch (error2) {
      toast.error(error2?.response?.data?.message || error2?.message);
      console.error("Update Service Appointment Error:", error2);

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: old.status } : a)),
      );
    }
  }

  async function rescheduleRemote(id, dateStr, time24) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    const [hh, mm] = time24.split(":").map(Number);
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ampm = hh >= 12 ? "PM" : "AM";
    const timeStr = `${formatTwo(hour12)}:${formatTwo(mm)} ${ampm}`;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              date: dateStr,
              hour: hour12,
              minute: mm,
              ampm,
              status: "Rescheduled",
            }
          : a,
      ),
    );

    toast.info(
      `Rescheduling appointment #${id} → ${formatDateNice(dateStr)} ${timeStr}`,
    );
    console.log(`Rescheduling appointment #${id} to ${dateStr} ${timeStr}`);

    try {
      const response3 = await api.put(
        API_ROUTES.SERVICEAPPOINTMENT.SERVICEAPPOINTMENTS_UPDATE(id),
        {
          rescheduledTo: { date: dateStr, time: timeStr },
          status: "Rescheduled",
        },
      );

      console.log("Reschedule Service Appointment API Response:", response3);

      const data3 = response3.data;

      if (data3?.success) {
        toast.success(
          data3?.message ||
            `Appointment #${id} rescheduled` ||
            `Appointment #${id} moved to ${formatDateNice(finalDate)} ${finalTimeStr}`,
        );
        console.log(
          "Reschedule Service Appointment Success:",
          data3?.message ||
            `Appointment #${id} final reschedule: ${finalDate} ${finalTimeStr}`,
        );

        const updated = data3?.data || data3?.appointment || {};

        const finalDate =
          updated.date || updated.rescheduledTo?.date || dateStr || appt.date;

        const finalTimeStr =
          updated.time ||
          updated.rescheduledTo?.time ||
          timeStr ||
          `${formatTwo(appt.hour)}:${formatTwo(appt.minute)} ${appt.ampm}`;

        const parsed = parseTimeToParts(finalTimeStr);

        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  date: finalDate,
                  hour: parsed.hour,
                  minute: parsed.minute,
                  ampm: parsed.ampm,
                  status: updated.status || "Rescheduled",
                  raw: updated || a.raw,
                }
              : a,
          ),
        );
      } else {
        toast.warn(
          data3?.message || "Reschedule Service appointment with warning",
        );
        console.warn("Reschedule Service Appointment Warning:", data3?.message);

        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  date: appt.date,
                  hour: appt.hour,
                  minute: appt.minute,
                  ampm: appt.ampm,
                  status: appt.status,
                }
              : a,
          ),
        );
      }
    } catch (error3) {
      toast.error(error3?.response?.data?.message || error3?.message);
      console.error("Reschedule Service Appointment Error:", error3);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                date: appt.date,
                hour: appt.hour,
                minute: appt.minute,
                ampm: appt.ampm,
                status: appt.status,
              }
            : a,
        ),
      );

      await loadServiceAppointments();
    }
  }

  async function cancelRemote(id) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    if (appt.status === "Canceled") {
      toast.warn(`Appointment #${id} is already Canceled`);
      console.warn("Cancel blocked: already canceled", appt);
      return;
    }

    if (appt.status === "Completed") {
      toast.warn(`Appointment #${id} is already Completed`);
      console.warn("Cancel blocked: already completed", appt);
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Canceled" } : a)),
    );

    toast.info(`Canceling appointment #${id}`);
    console.log("Canceling appointment:", {
      id,
      patient: appt.patientName,
      date: appt.date,
    });

    try {
      const response4 = await api.post(
        API_ROUTES.SERVICEAPPOINTMENT.SERVICEAPPOINTMENTS_CANCEL(id),
      );

      console.log("Cancel Appointment API Response:", response4);
      const data4 = response4.data;

      if (data4?.success) {
        toast.success(data4?.message || `Appointment #${id} canceled`);
        console.log("Cancel Appointment Success:", data4?.message);

        const updated = data4?.data || data4?.appointment || {};

        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: updated.status || "Canceled",
                  raw: updated || a.raw,
                }
              : a,
          ),
        );
      } else {
        toast.warn(data4?.message || "Cancel Appointment with warning");
        console.warn("Cancel Appointment Warning:", data4?.message);

        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: appt.status } : a)),
        );
      }
    } catch (error4) {
      toast.error(error4?.response?.data?.message || error4?.message);
      console.error("Cancel Appointment Error:", error4);

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: appt.status } : a)),
      );
      await loadServiceAppointments();
    }
  }

  function askCancel(appointment) {
    setSelectedAppt(appointment);
    setOpenCancelPopup(true);
  }

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return appointments
      .filter((a) =>
        q
          ? (a.patientName || "").toLowerCase().includes(q) ||
            (a.serviceName || "").toLowerCase().includes(q)
          : true,
      )
      .filter((a) => (statusFilter ? a.status === statusFilter : true));
  }, [appointments, debouncedSearch, statusFilter]);

  function getTimestamp(a) {
    try {
      const [y, m, d] = (a.date || "1970-01-01").split("-").map(Number);
      let hour = Number(a.hour) || 0;
      if ((a.ampm || "AM") === "PM" && hour !== 12) hour += 12;
      if ((a.ampm || "AM") === "AM" && hour === 12) hour = 0;
      const minute = Number(a.minute) || 0;
      return new Date(y, (m || 1) - 1, d || 1, hour, minute).getTime();
    } catch {
      return 0;
    }
  }
  const displayList = useMemo(() => {
    const copy = filtered.slice();
    copy.sort((x, y) => getTimestamp(y) - getTimestamp(x));
    return copy;
  }, [filtered]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-6 font-serif bg-linear-to-br from-blue-50 via-blue-100 to-white">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-800">
            Appointments
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage patient bookings - quick search & status controls
          </p>
        </div>

        <div className="w-full md:w-96 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label className="relative block w-full">
              <span className="sr-only">Search Appointments</span>

              <div className="flex items-center gap-2 relative w-full">
                <div className="absolute left-3 pointer-events-none">
                  <SearchIcon className="w-4 h-4 text-indigo-400" />
                </div>

                <InputField
                  control={control}
                  name="search"
                  type="text"
                  placeholder="Search by patient or service..."
                  unstyled={false}
                  inputClassName="pl-10 pr-10 w-full rounded-full border border-indigo-200 bg-white/90 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearch(val);
                    setValue("search", val, { shouldDirty: true });
                  }}
                />

                {search ? (
                  <button
                    className="absolute right-3 rounded-full p-1 hover:bg-gray-100"
                    onClick={() => setSearch("")}
                  >
                    <XIcon className="w-4 h-4 text-gray-500" />
                  </button>
                ) : null}
              </div>
            </label>

            <SelectInput
              control={control}
              name="statusFilter"
              options={statusOptions}
              placeholder="All"
              selectClassName=""
              className="w-full"
              onChange={(opt) => {
                const val = opt?.value ?? "";
                setStatusFilter(val);
                setValue("statusFilter", val, { shouldDirty: true });
              }}
            />
          </div>

          <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <div>
              {displayList.length} result{displayList.length !== 1 ? "s" : ""}
            </div>

            <div>
              <button
                onClick={loadServiceAppointments}
                className="text-xs text-indigo-600 hover:underline"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="col-span-full flex text-center items-center justify-center  text-black py-8 gap-3">
          <ClipLoader size={18} color="#3B82F6" />
          <span className="text-sm animate-pulse">Loading Appointments...</span>
        </div>
      ) : error ? (
        <div className="col-span-full rounded-2xl p-4 bg-red--50 border border-red--100 text-red--700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {displayList.length === 0 ? (
            <div className="col-span-full rounded-2xl p-8 bg-white/90 border border-indigo-50 shadow-sm flex items-center justify-center flex-col gap-3">
              <div className="text-3xl text-indigo-300">
                <SearchIcon />
              </div>
              <div className="text-sm text-gray-600">
                No appointments match your search
              </div>
              <div className="text-sm text-gray-600">
                Try a different patient name or service
              </div>
            </div>
          ) : (
            displayList.map((a) => {
              const isLocked =
                a.status === "Completed" || a.status === "Canceled";

              const statusStyle =
                a.status === "Pending"
                  ? {
                      border: "border-lime-300/70",
                      bg: "bg-lime-100/70",
                      icon: "text-lime-700",
                      text: "text-lime-800",
                    }
                  : a.status === "Confirmed"
                    ? {
                        border: "border-indigo-300/70",
                        bg: "bg-indigo-100/70",
                        icon: "text-indigo-700",
                        text: "text-indigo-800",
                      }
                    : a.status === "Canceled"
                      ? {
                          border: "border-rose-300/70",
                          bg: "bg-rose-100/70",
                          icon: "text-rose-700",
                          text: "text-rose-800",
                        }
                      : a.status === "Completed"
                        ? {
                            border: "border-cyan-300/70",
                            bg: "bg-cyan-100/70",
                            icon: "text-cyan-700",
                            text: "text-cyan-800",
                          }
                        : a.status === "Rescheduled"
                          ? {
                              border: "border-emerald-300/70",
                              bg: "bg-emerald-100/70",
                              icon: "text-emerald-700",
                              text: "text-emerald-800",
                            }
                          : {
                              border: "border-gray-200",
                              bg: "bg-gray-100",
                              icon: "text-gray-700",
                              text: "text-gray-800",
                            };

              return (
                <article
                  key={a.id}
                  className="group relative rounded-3xl p-1 animated-border h-full transform transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`card-inner rounded-2xl overflow-hidden border ${statusStyle.border} p-5 bg-white/90 shadow-lg h-full flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div
                            className={`rounded-full w-10 h-10 flex items-center justify-center ${statusStyle.bg}`}
                          >
                            <User className={`h-5 w-5 ${statusStyle.icon}`} />
                          </div>

                          <div>
                            <div className="text-lg md:text-sm lg:text-xs xl:text-md whitespace-nowrap font-bold leading-tight text-indigo-900 w-full line-clamp-2">
                              {a.patientName}
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                              {a.gender} • {a.age} yrs
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
                          <StatusBadge status={a.status} />
                          <div className="mt-1">
                            <StatusSelect
                              appointment={a}
                              onChange={(s) => changeStatusRemote(a.id, s)}
                              disabled={false}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 text-black">
                        <div className="flex items-center gap-3 text-base">
                          <Phone className={`w-4 h-4 ${statusStyle.icon}`} />
                          <span className="font-medium truncate">
                            {a.mobile}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-base">
                          <Banknote className={`w-4 h-4 ${statusStyle.icon}`} />
                          <span className="font-semibold">
                            Fees: LKR {a.fees}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-base">
                          <Calendar className={`w-4 h-4 ${statusStyle.icon}`} />
                          <span className="font-medium truncate">
                            Date: {formatDateNice(a.date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-base">
                          <Clock className={`w-4 h-4 ${statusStyle.icon}`} />
                          <span className="font-medium truncate">
                            Time: {formatTimeDisplay(a)}
                          </span>
                        </div>

                        <div className="mt-2 text-base text-black">
                          Service:{" "}
                          <span className={`font-semibold ${statusStyle.text}`}>
                            {a.serviceName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1">
                          <RescheduleButton
                            appointment={a}
                            onReschedule={(d, t) =>
                              rescheduleRemote(a.id, d, t)
                            }
                            disabled={false}
                          />
                        </div>

                        <div className="ml-3">
                          <button
                            onClick={() => askCancel(a)}
                            disabled={isLocked}
                            className={`px-3 py-1 rounded-full text-sm border ${
                              isLocked
                                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-red-600 border-red-200 hover:shadow-sm"
                            }`}
                            title={
                              isLocked ? "Cannot cancel" : "Cancel appointment"
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {openCancelPopup && selectedAppt && (
        <DeletePopup
          onClose={() => {
            if (cancelLoading) return;
            setOpenCancelPopup(false);
            setSelectedAppt(null);
          }}
          onDelete={async () => {
            if (!selectedAppt?.id) return;

            setCancelLoading(true);
            try {
              await cancelRemote(selectedAppt.id);
              setOpenCancelPopup(false);
              setSelectedAppt(null);
            } finally {
              setCancelLoading(false);
            }
          }}
          loading={cancelLoading}
          name={selectedAppt?.patientName}
          title="Cancel this appointment?"
          message={
            <>
              Do you really want to cancel <b>{selectedAppt?.patientName}</b>’s
              appointment? <br />
              This action cannot be undone.
            </>
          }
          confirmText="Cancel"
        />
      )}
    </div>
  );
};

export default ServiceAppointmentsPage;
