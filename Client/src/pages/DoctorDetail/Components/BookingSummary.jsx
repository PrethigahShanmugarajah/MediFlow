// MediFlow / Client / src / pages / DoctorDetail / Components / BookingSummary.jsx
import { ClipLoader } from "react-spinners";
import PaymentSelector from "./PaymentSelector";
import { Phone } from "lucide-react";

const BookingSummary = ({
  doctor,
  selectedDate,
  selectedSlot,
  fee,
  paymentMethod,
  setPaymentMethod,
  isSubmitting,
  onConfirm,
}) => {
  const disabled = !selectedDate || !selectedSlot || isSubmitting;

  return (
    <div className="bg-linear-to-r from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-indigo-100">
      <div className="space-y-3 mb-4 sm:mb-6">
        <div className="flex justify-between">
          <span className="text-md text-gray-600">Selected Doctor:</span>
          <span className="font-semibold text-indigo-700 text-sm sm:text-base">
            {doctor?.name || "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-md text-gray-600">Doctor Speciality:</span>
          <span className="font-semibold text-indigo-700 text-sm sm:text-base">
            {doctor?.specialization || doctor?.speciality || "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-md text-gray-600">Selected Date:</span>
          <span className="font-semibold text-indigo-700 text-sm sm:text-base">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Not selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-md text-gray-600">Selected Time:</span>
          <span className="font-semibold text-indigo-700 text-sm sm:text-base">
            {selectedSlot || "Not selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-md text-gray-600">Consultation Fee:</span>
          <span className="font-bold text-red-600">LKR {fee}</span>
        </div>
      </div>

      {/* -------- Payment Method Selector -------- */}
      <PaymentSelector
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <button
        onClick={onConfirm}
        disabled={disabled}
        className={`w-full py-3 sm:py-4 px-4 rounded-full font-semibold text-sm cursor-pointer transition-all ${
          !selectedDate || !selectedSlot || isSubmitting
            ? "bg-gray-300 text-gray-500"
            : "bg-linear-to-r from-indigo-500 to-blue-500 text-white"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <span>
            {isSubmitting ? (
              <div className="col-span-full flex text-center items-center justify-center text-black gap-3">
                <ClipLoader size={18} color="#3B82F6" />
                <span className="text-sm">Booking...</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Phone className="w-5 h-5" />
                <span>Confirm Booking</span>
              </div>
            )}
          </span>
        </div>
      </button>
    </div>
  );
};

export default BookingSummary;
