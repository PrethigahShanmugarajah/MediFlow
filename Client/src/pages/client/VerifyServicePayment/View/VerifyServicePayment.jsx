// MediFlow / Client / src / pages / client / VerifyServicePayment / View / VerifyServicePayment.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyServicePaymentApi } from "../Service/VerifyServicePaymentService";

const VerifyServicePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyServicePaymentService = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      if (location.pathname === "/service-appointment/cancel") {
        if (!cancelled) {
          navigate("/appointments?service_payment=Cancelled", {
            replace: true,
          });
        }
        return;
      }

      if (!sessionId) {
        if (!cancelled) {
          navigate("/appointments?service_payment=Failed", {
            replace: true,
          });
        }
        return;
      }

      try {
        const data = await verifyServicePaymentApi(sessionId);
        if (cancelled) return;
        if (data?.success) {
          navigate("/appointments?service_payment=Paid", {
            replace: true,
          });
        } else {
          navigate("/appointments?service_payment=Failed", {
            replace: true,
          });
        }
      } catch (error) {
        if (!cancelled)
          navigate("/appointments?service_payment=Failed", {
            replace: true,
          });
        return;
      }
    };

    verifyServicePaymentService();
    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return null;
};

export default VerifyServicePayment;
