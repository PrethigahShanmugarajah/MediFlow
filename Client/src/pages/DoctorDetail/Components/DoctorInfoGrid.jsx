// MediFlow / Client / src / pages / DoctorDetail / Components / DoctorInfoGrid.jsx
import { Clock, GraduationCap, MapPin, Shield } from "lucide-react";

const DoctorInfoGrid = ({doctor, fee}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4">
      <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
        <GraduationCap className="w-5 h-5 text-indigo-500 mt-1" />
        <div>
          <div className="text-sm font-semibold text-indigo-600">
            Qualifications
          </div>
          <div className="text-gray-700 font-medium">
            {doctor.qualifications}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
        <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
        <div>
          <div className="text-sm font-semibold text-indigo-600">Location</div>
          <div className="text-gray-700 font-medium">{doctor.location}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
        <Clock className="w-5 h-5 text-indigo-500 mt-1" />
        <div>
          <div className="text-sm font-semibold text-indigo-600">
            Consultation Fee
          </div>
          <div className="text-lg font-bold text-red-600">LKR {fee}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 md:p-3 p-4 bg-white rounded-full shadow-sm border border-indigo-50">
        <Shield className="w-5 h-5 text-indigo-500 mt-1" />
        <div>
          <div className="text-sm font-semibold text-indigo-600">
            Availability
          </div>
          <div className="text-gray-700 font-medium">
            {doctor.availability === "Available" || doctor.available
              ? "Available"
              : "Available Soon"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoGrid;
