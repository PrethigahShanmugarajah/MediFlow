// MediFlow / Client / src / pages / ServiceDetail / Service / ServiceDetailService.jsx
import {
  fetchServiceBookedSlots,
  fetchServiceByID,
} from "../../../../services/fetch";
import { createServiceAppointment } from "../../../../services/mutations";
import {
  buildServiceAppointmentPayload,
  handleServiceAppointmentRedirect,
  validateServiceBooking,
} from "../../../../utils/client/serviceDetailUtils";

/* -------- Fetch service by id (used in useEffect) -------- */
export async function fetchServiceByIdApi(id) {
  if (!id) return null;

  try {
    const payload = await fetchServiceByID(id);

    return payload?.data || payload?.service || payload || null;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404) return null;
    throw error;
  }
}

/* -------- Create service appointment + redirect -------- */
export async function bookServiceAppointmentApi({
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
}) {
  const check = validateServiceBooking({
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

  const payload = buildServiceAppointmentPayload({
    service,
    formData,
    selectedDate,
    selectedSlot,
    fee,
    paymentMethod,
  });

  const body = await createServiceAppointment({ payload, token });

  handleServiceAppointmentRedirect(body);

  return { ok: true, message: "" };
}

/* -------- Fetch booked slots for selected date -------- */
export async function fetchServiceBookedSlotsApi(serviceId, dateISO) {
  try {
    const payload = await fetchServiceBookedSlots(serviceId, dateISO);

    const booked =
      payload?.bookedSlots ||
      payload?.data?.bookedSlots ||
      payload?.appointments?.map((a) => a.time) ||
      [];

    return booked;
  } catch (error) {
    return [];
  }
}
