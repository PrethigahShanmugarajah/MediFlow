import { loginDoctor } from "../../../../services/mutations";
import {
  extractDoctorAuth,
  persistDoctorToken,
} from "../../../../utils/doctor/loginUtils";

export async function loginDoctorApi({ formData, storageKey }) {
  if (!formData?.email || !formData?.password) {
    return {
      ok: false,
      message: "Please complete all required fields before proceeding.",
    };
  }

  const json = await loginDoctor(formData);

  if (!json?.success) {
    return { ok: false, message: "" };
  }

  const { token, doctorId } = extractDoctorAuth(json);

  if (!token) {
    return {
      ok: false,
      message:
        "Authentication token is missing. Please sign in again to continue.",
    };
  }

  if (!doctorId) {
    return {
      ok: false,
      message:
        "The doctor ID was not found in the server response. Please try again.",
    };
  }

  persistDoctorToken(storageKey, token);

  return {
    ok: true,
    doctorId,
  };
}
