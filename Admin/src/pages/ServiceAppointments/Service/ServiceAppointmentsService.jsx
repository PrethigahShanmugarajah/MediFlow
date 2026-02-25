// MediFlow / Admin / src / pages / ServiceAppointments / Service / ServiceAppointmentsService.jsx
import { fetchServiceAppointments } from "../../../services/fetch";
import {
  cancelServiceAppointments,
  updateServiceAppointments,
} from "../../../services/mutations";
import {
  applyRescheduleResult,
  applyUpdatedAppointmentFields,
  extractAppointmentsList,
  extractUpdatedAppointment,
  normalizeAppointments,
  time24ToParts,
} from "../../../utils/serviceAppointmentsUtils";

export async function loadServiceAppointmentsApi(
  setAppointments,
  setError,
  setLoading,
) {
  setLoading?.(true);
  setError?.(null);

  try {
    const data = await fetchServiceAppointments({ limit: 500 });
    const list = extractAppointmentsList(data);
    setAppointments(normalizeAppointments(list));
  } catch (error) {
    setError?.(error?.message || "Failed to load appointments.");
    setAppointments([]);
  } finally {
    setLoading?.(false);
  }
}

export async function changeAppointmentStatusApi(
  id,
  newStatus,
  appointments,
  setAppointments,
) {
  const old = appointments.find((a) => a.id === id);
  if (!old) return false;

  setAppointments((prev) =>
    prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
  );

  try {
    const body = await updateServiceAppointments(id, { status: newStatus });
    const updated = extractUpdatedAppointment(body);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? applyUpdatedAppointmentFields(a, updated, newStatus) : a,
      ),
    );

    return true;
  } catch (error) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: old.status } : a)),
    );
    return false;
  }
}

export async function rescheduleAppointmentApi(
  id,
  dateStr,
  time24,
  appointments,
  setAppointments,
  refetch,
) {
  const appt = appointments.find((a) => a.id === id);
  if (!appt) return false;

  const { timeStr, hour, minute, ampm } = time24ToParts(time24);

  setAppointments((prev) =>
    prev.map((a) =>
      a.id === id
        ? { ...a, date: dateStr, hour, minute, ampm, status: "Rescheduled" }
        : a,
    ),
  );

  try {
    const body = await updateServiceAppointments(id, {
      rescheduledTo: { date: dateStr, time: timeStr },
      status: "Rescheduled",
    });

    const updated = extractUpdatedAppointment(body);
    const finalItem = applyRescheduleResult(appt, updated, dateStr, timeStr);

    setAppointments((prev) => prev.map((a) => (a.id === id ? finalItem : a)));
    return true;
  } catch (error) {
    await refetch?.();
    return false;
  }
}

export async function cancelAppointmentApi(
  id,
  appointments,
  setAppointments,
  refetch,
) {
  const appt = appointments.find((a) => a.id === id);
  if (!appt) return false;

  setAppointments((prev) =>
    prev.map((a) => (a.id === id ? { ...a, status: "Canceled" } : a)),
  );

  try {
    const body = await cancelServiceAppointments(id);
    const updated = extractUpdatedAppointment(body);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: updated?.status || "Canceled",
              raw: updated || a.raw,
            }
          : a,
      ),
    );

    return true;
  } catch (error) {
    await refetch?.();
    return false;
  }
}
