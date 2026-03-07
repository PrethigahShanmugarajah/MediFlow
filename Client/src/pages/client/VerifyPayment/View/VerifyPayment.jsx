// MediFlow / Client / src / pages / client / VerifyPayment / View / VerifyPayment.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPaymentApi } from "../Service/VerifyPaymentService";

const VerifyPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyPaymentService = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      if (location.pathname === "/appointment/cancel") {
        if (!cancelled)
          navigate("/appointments?payment_status=Cancelled", { replace: true });
        return;
      }

      if (!sessionId) {
        if (!cancelled)
          navigate("/appointments?payment_status=Failed", { replace: true });
        return;
      }

      try {
        const data = await verifyPaymentApi(sessionId);
        if (cancelled) return;
        if (data?.success) {
          navigate("/appointments?payment_status=Paid", { replace: true });
        } else {
          navigate("/appointments?payment_status=Failed", { replace: true });
        }
      } catch (error) {
        if (!cancelled)
          navigate("/appointments?payment_status=Failed", { replace: true });
        return;
      }
    };

    verifyPaymentService();
    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return null;
};

export default VerifyPayment;
