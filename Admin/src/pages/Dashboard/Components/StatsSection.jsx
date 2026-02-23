// MediFlow / Admin / src / pages / Dashboard / Components / StatsSection.jsx
import { ClipLoader } from "react-spinners";
import StatCard from "../../../components/StatCard";
import {
  Banknote,
  CheckCircle,
  Stethoscope,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { CURRENCY } from "../../../utils/helpers";

const StatsSection = ({
  totals,
  patientCount,
  patientCountLoading,
  loading,
}) => {
  const loader = (
    <div className="mt-1">
      <ClipLoader size={20} color="#6366F1" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      <StatCard
        icon={<Stethoscope className="w-6 h-6" />}
        label="Total Doctors"
        value={loading ? loader : totals.totalDoctors}
      />

      <StatCard
        icon={<UserRoundCheck className="w-6 h-6" />}
        label="Total Registered Users"
        value={
          patientCountLoading
            ? loader
            : (patientCount ?? totals.totalLoginPatients)
        }
      />

      <StatCard
        icon={<Banknote className="w-6 h-6" />}
        label="Total Earnings"
        value={
          loading
            ? loader
            : `${CURRENCY} ${totals.totalEarnings.toLocaleString()}`
        }
      />

      <StatCard
        icon={<CheckCircle className="w-6 h-6" />}
        label="Completed"
        value={loading ? loader : totals.completed}
      />

      <StatCard
        icon={<XCircle className="w-6 h-6" />}
        label="Canceled"
        value={loading ? loader : totals.canceled}
      />
    </div>
  );
};

export default StatsSection;
