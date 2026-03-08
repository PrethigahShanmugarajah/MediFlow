import { fetchDoctorByID } from "../../../../services/fetch";
import {
  changeDoctorAvailability,
  updateDoctor,
} from "../../../../services/mutations";
import {
  buildDoctorUpdateFormData,
  normalizeDoctorFromApi,
} from "../../../../utils/doctor/doctorEditProfileUtils";

export async function fetchDoctorProfileApi(id) {
  if (!id)
    return { ok: false, doctor: null, message: "Doctor ID is required." };

  try {
    const json = await fetchDoctorByID(id);
    const doctor = normalizeDoctorFromApi(json);
    return { ok: true, doctor };
  } catch (error) {
    return {
      ok: false,
      doctor: null,
      error,
      message:
        error?.message ||
        "Unable to load the doctor profile at this time. Please try again.",
    };
  }
}

export async function saveDoctorProfileApi({ id, doc, localImageFile, token }) {
  if (!id || !doc) return { ok: false, doctor: null, message: "Invalid data." };

  try {
    const form = buildDoctorUpdateFormData(doc, localImageFile);
    const json = await updateDoctor(id, form, token);
    const updatedDoctor = normalizeDoctorFromApi(json);

    return { ok: true, doctor: updatedDoctor };
  } catch (error) {
    return {
      ok: false,
      doctor: null,
      error,
      message:
        error?.message ||
        "Unable to save the profile at this time. Please try again.",
    };
  }
}

export async function changeDoctorAvailabilityApi({ id, token }) {
  if (!id) {
    return {
      ok: false,
      message: "Doctor ID is required.",
    };
  }

  try {
    const json = await changeDoctorAvailability(id, token);
    const doctor = normalizeDoctorFromApi(json);
    return { ok: true, doctor };
  } catch (error) {
    return {
      ok: false,
      error,
      message:
        error?.message ||
        "Unable to update availability at this time. Please try again.",
    };
  }
}
