// MediFlow / Client / src / pages / client / Appointments / Components / PaymentBadge.jsx
import { CreditCard, Wallet } from "lucide-react";

const PaymentBadge = ({ payment }) => {
  return payment === "Online" ? (
    <span className="px-3 py-1 rounded-full font-semibold text-xs bg-sky-100 text-sky-700 border border-sky-300 flex items-center gap-1">
      <CreditCard className="w-3" /> Online
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full font-semibold text-xs bg-violet-100 text-violet-700 border border-violet-300 flex items-center gap-1">
      <Wallet className="w-3" /> Cash
    </span>
  );
};

export default PaymentBadge;
