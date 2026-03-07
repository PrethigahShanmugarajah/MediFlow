// MediFlow / Admin / src / pages / ServiceAppointments / Components / Card.jsx
import { Banknote, Calendar, Clock, Phone, User } from "lucide-react";
import StatusBadge from "./StatusBadge";
import RescheduleButton from "./RescheduleButton";
import { CURRENCY } from "../../../utils/helpers";
import {
  formatDateNice,
  formatPatientName,
  formatTimeDisplay,
  isStatusLocked,
} from "../../../utils/serviceAppointmentsUtils";
import { SelectInput } from "../../../components/FormField/SelectInput";
import "../ServiceAppointments.css";

const Card = ({ a, onChangeStatus, onReschedule, onCancel }) => {
  const isLocked = isStatusLocked(a.status);

  return (
    <article className="group relative rounded-3xl p-1 animated-border h-full transform transition-all duration-300 hover:-translate-y-2">
      <div className="card-inner rounded-2xl overflow-hidden border-2 border-indigo-300/60 p-5 bg-white/90 shadow-lg h-full flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div>
                <div className="text-lg md:text-sm lg:text-xs xl:text-md whitespace-nowrap font-bold leading-tight text-indigo-900 w-full line-clamp-2">
                  {formatPatientName(a.patientName)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {a.gender} • {a.age} yrs
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 mt-2 sm:mt-0">
              <StatusBadge status={a.status} />
              <div className="mt-1">
                <SelectInput
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "Confirmed", label: "Confirmed" },
                    { value: "Completed", label: "Completed" },
                    { value: "Canceled", label: "Canceled" },
                  ]}
                  value={a.status}
                  onChange={(val) => onChangeStatus(a.id, val)}
                  isDisabled={isLocked}
                  isClearable={false}
                  placeholder="Status"
                  size="m sm:m md:xs lg:xs xl:xs"
                  className="w-24 sm:w-41 md:w-32 lg:w-32 xl:w-32"
                  disabledVariant="muted"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-gray-700">
            <div className="flex items-center gap-3 text-base">
              <Phone className="w-4 h-4 text-indigo-500" />
              <span className="font-medium truncate">{a.mobile}</span>
            </div>

            <div className="flex items-center gap-3 text-base">
              <Banknote className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold">
                Fees: {CURRENCY} {a.fees}
              </span>
            </div>

            <div className="flex items-center gap-3 text-base">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span className="font-medium truncate">
                Date: {formatDateNice(a.date)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-base">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="font-medium truncate">
                Time: {formatTimeDisplay(a)}
              </span>
            </div>

            <div className="mt-2 text-base text-gray-600">
              Service:
              <span className="font-semibold text-indigo-800">
                {a.serviceName}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <RescheduleButton
                appointment={a}
                onReschedule={(d, t) => onReschedule(a.id, d, t)}
                disabled={false}
              />
            </div>

            <div className="ml-3">
              <button
                onClick={() => onCancel(a.id)}
                disabled={isLocked}
                className={`px-3 py-1 rounded-full text-sm border ${
                  isLocked
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-red-600 border-red-200 hover:shadow-sm"
                }`}
                title={isLocked ? "Cannot cancel" : "Cancel appointment"}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
