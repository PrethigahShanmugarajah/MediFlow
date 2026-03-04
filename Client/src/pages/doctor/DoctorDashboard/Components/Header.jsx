// MediFlow / Client / src / pages / doctor / DoctorDashboard / Components / Header.jsx
import { BeatLoader } from "react-spinners";
import DocTitle from "../../../../components/doctor/DocTitle";
import { formatDoctorName } from "../../../../utils/doctor/doctorDashboardUtils";

const Header = ({
  doctorName,
  doctorId,
  loading,
  totalAppointments,
  onRefresh,
}) => {
  const title = doctorName
    ? `${formatDoctorName(doctorName)} — Control Panel`
    : "Doctor Control Panel";

  const description = doctorId
    ? `Displaying scheduled appointments for Doctor ID: ${doctorId}`
    : "Summary of recent appointments and total revenue";

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <DocTitle title={title} description={description} />

      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-600">
          {loading ? (
            <BeatLoader size={6} color="#6366F1" />
          ) : (
            `${totalAppointments} total`
          )}
        </div>
        <button
          onClick={onRefresh}
          className="text-sm px-3 py-1 rounded-full bg-white text-indigo-600 border border-indigo-200 hover:shadow-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Header;
