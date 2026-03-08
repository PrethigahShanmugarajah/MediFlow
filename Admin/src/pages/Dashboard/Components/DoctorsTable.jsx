import { ScaleLoader } from "react-spinners";
import {
  capitalizeWords,
  CURRENCY,
  formatDoctorName,
} from "../../../utils/helpers";
import { NoPersonImage } from "../../../assets";

const DoctorsTable = ({ doctors, loading, query }) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-50">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
              Doctor
            </th>

            <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
              Specialization
            </th>

            <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
              Fee
            </th>

            <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
              Appointments
            </th>

            <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
              Completed
            </th>

            <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
              Canceled
            </th>

            <th className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
              Total Earnings
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-blue-50 cursor-pointer">
          {doctors.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center justify-center py-10 text-gray-500 font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center ">
                    <ScaleLoader height={28} width={4} color="#6366F1" />
                  </div>
                ) : query ? (
                  "No doctors match your search"
                ) : (
                  "No doctors found"
                )}
              </td>
            </tr>
          ) : (
            doctors.map((d, idx) => (
              <tr
                key={d?.id}
                className={`group transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                  <div className="w-1 h-12 rounded-md mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-b from-indigo-400 to-blue-200" />
                  <img
                    src={d?.image || NoPersonImage}
                    alt={formatDoctorName(d?.name)}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {formatDoctorName(d?.name)}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ID: {d?.id}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-600">
                  {capitalizeWords(d?.specialization)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-700">
                  {CURRENCY} {d?.fee}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-700">
                  {d?.appointments.total}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-indigo-600">
                  {d?.appointments.completed}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-rose-500">
                  {d?.appointments.canceled}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-slate-800">
                  {CURRENCY} {d?.earnings.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;
