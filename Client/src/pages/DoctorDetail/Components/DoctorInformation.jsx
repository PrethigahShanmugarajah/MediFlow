// MediFlow / Client / src / pages / DoctorDetail / Components / DoctorInformation.jsx
import {
  BadgeInfo,
  Banknote,
  GraduationCap,
  MapPin,
  Shield,
  Zap,
} from "lucide-react";
import { CURRENCY } from "../../../utils/helpers";
import { formatDoctorName } from "../../../utils/doctorDetailUtils";

const DoctorInformation = ({ doctor, fee }) => {
  const speciality =
    doctor?.specialization ||
    doctor?.speciality ||
    doctor?.specialization ||
    "—";

  const availability =
    doctor?.availability === "Available" || doctor?.available
      ? "Available"
      : "Available Soon";

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl md:text-2xl lg:text-3xl xl:text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          {formatDoctorName(doctor.name)}
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-400 to-blue-500 text-white rounded-full text-sm font-semibold shadow-lg">
          <Zap className="w-4 h-4" />
          {speciality}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4">
        <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
          <GraduationCap className="w-5 h-5 text-indigo-500 mt-1" />
          <div>
            <div className="text-sm font-semibold text-indigo-600">
              Qualifications
            </div>

            <div className="text-black font-medium">
              {doctor?.qualifications || "-"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
          <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
          <div>
            <div className="text-sm font-semibold text-indigo-600">
              Location
            </div>

            <div className="text-black font-medium">
              {doctor?.location || "-"}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
          <Banknote className="w-5 h-5 text-indigo-500 mt-1" />
          <div>
            <div className="text-sm font-semibold text-indigo-600">
              Consultation Fee
            </div>

            <div className="text-lg font-bold text-red-600">
              {CURRENCY} {fee}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
          <Shield className="w-5 h-5 text-indigo-500 mt-1" />
          <div>
            <div className="text-sm font-semibold text-indigo-600">
              Availability
            </div>

            <div className="text-black font-medium">{availability}</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-sm border border-indigo-50">
        <div className="flex items-center gap-2 mb-4">
          <BadgeInfo className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-indigo-700">
            About Doctor
          </h3>
        </div>

        <p className="text-black leading-relaxed">
          {doctor?.about || doctor?.bio}
        </p>
      </div>
    </div>
  );
};

export default DoctorInformation;
