// MediFlow / Admin / src / pages / ListDoctors / Service / ListDoctorsService.jsx
import { fetchDoctors } from "../../../services/fetch";
import { deleteDoctor } from "../../../services/mutations";
import {
  buildScheduleMap,
  normalizeDoctors,
  normalizeDoctorsResponse,
} from "../../../utils/listDoctorsUtils";

export async function getDoctorsForList() {
  const body = await fetchDoctors();

  if (!body?.success) {
    const msg = body?.message || "Failed to fetch doctors";
    throw new Error(msg);
  }

  const list = normalizeDoctorsResponse(body);
  const normalized = normalizeDoctors(list, buildScheduleMap);

  return normalized;
}

export async function removeDoctorById(id) {
  const body = await deleteDoctor(id);

  if (!body?.success) {
    const msg = body?.message || "Failed to delete doctor";
    throw new Error(msg);
  }

  return body;
}
