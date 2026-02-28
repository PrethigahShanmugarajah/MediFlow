// MediFlow / Client / src / pages / DoctorDetail / Components / Summary.jsx
import { Phone } from "lucide-react";
import { CURRENCY } from "../../../utils/helpers";
import { RadioInput } from "../../../components/FormField/RadioInput";
import {
  formatDoctorName,
  paymentOptions,
} from "../../../utils/doctorDetailUtils";
import { ClipLoader } from "react-spinners";

const Summary = ({
  doctor,
  selectedDate,
  selectedSlot,
  fee,
  paymentMethod,
  setPaymentMethod,
  handleBooking,
  isSubmitting,
}) => {
  return (
    <div className="bg-linear-to-r from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-indigo-100">
      <div className="space-y-3 mb-4 sm:mb-6">
        <div className="flex justify-between">
          <span className="text-md text-gray-600">Selected Doctor:</span>
          <span className="font-semibold text-indigo-700 text-sm sm:text-base">
            {formatDoctorName(doctor?.name) || "—"}
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
          <span className="font-bold text-red-600">
            {CURRENCY} {fee}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <RadioInput
          name="payment"
          label="Payment"
          labelPosition="left"
          value={paymentMethod}
          onChange={(val) => setPaymentMethod(val)}
          size="sm"
          required
          options={paymentOptions}
          groupClassName="flex flex-wrap gap-2"
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={!selectedDate || !selectedSlot || isSubmitting}
        className={`w-full py-3 sm:py-4 px-4 rounded-full font-semibold text-sm cursor-pointer transition-all ${
          !selectedDate || !selectedSlot || isSubmitting
            ? "bg-gray-300 text-gray-500"
            : "bg-linear-to-r from-indigo-500 to-blue-500 text-white"
        }`}
      >
        <div className="flex justify-center">
          <span>
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={18} color="#6366F1" />
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

export default Summary;
