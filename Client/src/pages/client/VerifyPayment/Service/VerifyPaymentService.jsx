// MediFlow / Client / src / pages / client / VerifyPayment / Service / VerifyPaymentService
import { verifyPayment } from "../../../../services/fetch";

export async function verifyPaymentApi(sessionId) {
  if (!sessionId) {
    return { success: false };
  }

  const data = await verifyPayment(sessionId);
  return data;
}
