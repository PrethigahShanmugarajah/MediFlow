import { fetchAppointments } from "../../../services/fetch";
import { cancelAppointment } from "../../../services/mutations";
import { normalizeDoctorAppointments } from "../../../utils/appointmentsUtils";

export async function getAppointmentsForPage({
  limit = 200,
  search = "",
} = {}) {
  const data = await fetchAppointments({
    limit,
    ...(search ? { search } : {}),
  });

  return normalizeDoctorAppointments(data);
}

export async function adminCancelAppointmentById(id) {
  const data = await cancelAppointment(id);

  const updated = data?.appointment || data?.appointments || null;

  return { data, updated };
}

export async function reloadAppointments(limit = 200) {
  const body = await fetchAppointments({ limit });
  return normalizeDoctorAppointments(body);
}
