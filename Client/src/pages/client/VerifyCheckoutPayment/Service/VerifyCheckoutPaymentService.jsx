import {
  verifyPayment,
  verifyServicePayment,
} from "../../../../services/fetch";

export async function verifyCheckoutPaymentApi(sessionId, type = "doctor") {
  if (!sessionId) {
    return { success: false };
  }

  const verifyApi = type === "service" ? verifyServicePayment : verifyPayment;

  const data = await verifyApi(sessionId);
  return data;
}
