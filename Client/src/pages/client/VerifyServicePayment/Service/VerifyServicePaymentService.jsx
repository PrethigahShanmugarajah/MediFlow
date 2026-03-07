// MediFlow / Client / src / pages / client / VerifyServicePayment / Service / VerifyServicePaymentService.jsx
import { verifyServicePayment } from "../../../../services/fetch";

export async function verifyServicePaymentApi(sessionId) {
  if (!sessionId) {
    return { success: false };
  }

  const data = await verifyServicePayment(sessionId);
  return data;
}
