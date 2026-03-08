import {
  fetchServiceBookedSlots,
  fetchServiceByID,
} from "../../../../services/fetch";
import { createServiceAppointment } from "../../../../services/mutations";
import {
  buildBookingPayload,
  handleBookingRedirect,
  validatePatientBooking,
} from "../../../../utils/client/clientHelpers";

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
  const check = validatePatientBooking({
    formData,
    selectedDate,
    selectedSlot,
    authLoaded,
    userLoaded,
    isSignedIn,
    actionLabel: "booking",
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

  const payload = {
    serviceId: service?._id || service?.id,
    serviceName: service?.name || "",
    serviceImageUrl: service?.imageUrl || service?.image || "",
    serviceImagePublicId:
      service?.imagePublicId || service?.image?.publicId || "",

    ...buildBookingPayload({
      formData,
      selectedDate,
      selectedSlot,
      fee,
      paymentMethod,
    }),
  };

  const body = await createServiceAppointment({ payload, token });

  handleBookingRedirect(body);

  return { ok: true, message: "" };
}

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
