// MediFlow / Client / src / pages / DoctorDetail / Service / DoctorDetailService.jsx
import { fetchDoctorByID } from "../../../services/fetch";
import { createAppointment } from "../../../services/mutations";
import {
  buildAppointmentPayload,
  handleAppointmentRedirect,
  validateBooking,
} from "../../../utils/doctorDetailUtils";

/* -------- Fetch doctor by id (used in useEffect) -------- */
export async function fetchDoctorByIdApi(id) {
  if (!id) return null;
  try {
    const payload = await fetchDoctorByID(id);
    return payload?.data || null;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404) {
      return null;
    }
    throw error;
  }
}

/* -------- Create appointment + redirect -------- */
export async function bookAppointmentApi({
  doctor,
  formData,
  selectedDate,
  selectedSlot,
  fee,
  paymentMethod,
  authLoaded,
  userLoaded,
  isSignedIn,
  getToken,
}) {
  const check = validateBooking({
    formData,
    selectedDate,
    selectedSlot,
    authLoaded,
    userLoaded,
    isSignedIn,
  });

  if (!check.ok) {
    return { ok: false, message: check.message };
  }

  const token = await getToken?.();
  if (!token) {
    return {
      ok: false,
      message: "Unable to retrieve the authentication token. Please try again.",
    };
  }

  const payload = buildAppointmentPayload({
    doctor,
    formData,
    selectedDate,
    selectedSlot,
    fee,
    paymentMethod,
  });

  const body = await createAppointment({ payload, token });

  handleAppointmentRedirect(body);

  return { ok: true, message: "" };
}
