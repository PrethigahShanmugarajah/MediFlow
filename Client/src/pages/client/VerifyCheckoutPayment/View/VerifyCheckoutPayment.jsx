import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCheckoutPaymentApi } from "../Service/VerifyCheckoutPaymentService";

const VerifyCheckoutPayment = ({ type = "doctor" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyPaymentService = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      const cancelPath =
        type === "service"
          ? "/service-appointment/cancel"
          : "/appointment/cancel";

      const queryKey =
        type === "service" ? "service_payment" : "payment_status";

      if (location.pathname === cancelPath) {
        if (!cancelled) {
          navigate(`/appointments?${queryKey}=Cancelled`, { replace: true });
        }
        return;
      }

      if (!sessionId) {
        if (!cancelled) {
          navigate(`/appointments?${queryKey}=Failed`, { replace: true });
        }
        return;
      }

      try {
        const data = await verifyCheckoutPaymentApi(sessionId, type);

        if (cancelled) return;

        if (data?.success) {
          navigate(`/appointments?${queryKey}=Paid`, { replace: true });
        } else {
          navigate(`/appointments?${queryKey}=Failed`, { replace: true });
        }
      } catch {
        if (!cancelled) {
          navigate(`/appointments?${queryKey}=Failed`, { replace: true });
        }
      }
    };

    verifyPaymentService();

    return () => {
      cancelled = true;
    };
  }, [location, navigate, type]);

  return null;
};

export default VerifyCheckoutPayment;
