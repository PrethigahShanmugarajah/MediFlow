import { fetchBookedSlots, fetchDoctorByID } from "../../../../services/fetch";
import { createAppointment } from "../../../../services/mutations";
import {
  buildBookingPayload,
  handleBookingRedirect,
  validatePatientBooking,
} from "../../../../utils/client/clientHelpers";

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
  const check = validatePatientBooking({
    formData,
    selectedDate,
    selectedSlot,
    authLoaded,
    userLoaded,
    isSignedIn,
    actionLabel: "appointment",
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
    doctorId: doctor?._id || doctor?.id,
    doctorName: doctor?.name || "",
    speciality:
      doctor?.specialization ||
      doctor?.speciality ||
      doctor?.specialityName ||
      "",
    owner: doctor?.owner || undefined,
    doctorImageUrl: doctor?.imageUrl || doctor?.image || "",
    doctorImagePublicId: doctor?.imagePublicId || doctor?.image?.publicId || "",

    ...buildBookingPayload({
      formData,
      selectedDate,
      selectedSlot,
      fee,
      paymentMethod,
    }),
  };

  const body = await createAppointment({ payload, token });

  handleBookingRedirect(body);

  return { ok: true, message: "" };
}

export async function fetchBookedSlotsApi(doctorId, dateISO) {
  try {
    const payload = await fetchBookedSlots(doctorId, dateISO);
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
