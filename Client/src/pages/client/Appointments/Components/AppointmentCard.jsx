import { CalendarDays, Clock } from "lucide-react";
import PaymentBadge from "./PaymentBadge";
import StatusBadge from "./StatusBadge";

const AppointmentCard = ({
  image,
  title,
  specialization,
  experience,
  price,
  currency,
  date,
  time,
  payment,
  status,
  rescheduledTo,
  typeLabel,
}) => {
  return (
    <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
      {typeLabel && (
        <div className="mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
          {typeLabel}
        </div>
      )}

      <div className="w-24 h-24 rounded-full border-4 border-indigo-300 shadow-md bg-indigo-50 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-center mt-4 text-gray-800">
        {title}
      </h3>

      {specialization && (
        <div className="text-sm text-indigo-700 mt-1 text-center">
          {specialization} {experience ? `• ${experience}` : ""}
        </div>
      )}

      {price !== undefined && (
        <p className="text-center text-blue-700 font-semibold text-lg mt-2">
          {currency} {price}
        </p>
      )}

      <p className="mt-4 rounded-full border bg-indigo-50 border-indigo-200 py-2 px-4 w-full flex justify-center items-center gap-2 text-sm text-black">
        <CalendarDays className="w-4 h-4" /> {date}
      </p>

      <p className="mt-2 rounded-full border bg-indigo-50 border-indigo-200 py-2 px-4 w-full flex justify-center items-center gap-2 text-sm text-black">
        <Clock className="w-4 h-4" /> {time}
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <PaymentBadge payment={payment} />
        <StatusBadge itemStatus={status} />
      </div>

      {status === "Rescheduled" && rescheduledTo ? (
        <div className="mt-4 text-center text-sm text-blue-700">
          Rescheduled to{" "}
          <span className="font-semibold">
            {rescheduledTo.date}
            {rescheduledTo.time ? ` : ${rescheduledTo.time}` : ""}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default AppointmentCard;
