// MediFlow / Client / src / pages / client / Appointments / Service / AppointmentsService.jsx
import {
  fetchAppointmentsByPatient,
  fetchServiceAppointmentsByPatient,
} from "../../../../services/fetch";
import {
  filterDoctorAppointments,
  getAppointmentsArray,
} from "../../../../utils/client/appointmentsUtils";

/* -------- Fetch doctor appointments by patient -------- */
export async function fetchDoctorAppointmentsByPatientApi(getToken) {
  const token = await getToken?.();
  const data = await fetchAppointmentsByPatient(token);
  const arr = getAppointmentsArray(data);
  return filterDoctorAppointments(arr);
}

/* -------- Fetch service appointments by patient -------- */
export async function fetchServiceAppointmentsByPatientApi(getToken) {
  const token = await getToken?.();
  const data = await fetchServiceAppointmentsByPatient(token);
  return getAppointmentsArray(data);
}
