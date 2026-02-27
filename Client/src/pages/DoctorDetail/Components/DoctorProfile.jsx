// MediFlow / Client / src / pages / DoctorDetail / Components / DoctorProfile.jsx
import { Award, Heart, Users } from "lucide-react";
import { NoPersonImage } from "../../../assets";

const DoctorProfile = ({ doctor }) => {
  return (
    <div className="lg:col-span-1 flex flex-col items-center space-y-6">
      <div className="relative">
        <div className="absolute -inset-2 sm:-inset-3 md:-inset-6 bg-linear-to-br from-indigo-400 to-blue-400 rounded-full blur-lg opacity-50"></div>

        <img
          src={doctor.imageUrl || doctor.image || NoPersonImage}
          alt={doctor.name}
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-60 lg:h-60 rounded-full object-cover border-4 sm:border-6 md:border-8 border-white shadow-2xl z-10 transition-transform duration-300"
          style={{ objectPosition: "center" }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-4 w-full max-w-lg px-2">
        <div className="text-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg border border-indigo-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Heart className="w-5 h-5 mx-auto mb-2 text-red-500" />

          <div className="text-lg font-bold text-gray-800">
            {doctor.success}%
          </div>

          <div className="text-xs text-gray-500">Success</div>
        </div>

        <div className="text-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg border border-indigo-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Award className="w-5 h-5 mx-auto mb-2 text-sky-500" />

          <div className="text-lg font-bold text-gray-800">
            {doctor.experience} Years
          </div>

          <div className="text-xs text-gray-500">Experience</div>
        </div>

        <div className="text-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg border border-indigo-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <Users className="w-5 h-5 mx-auto mb-2 text-indigo-500" />

          <div className="text-lg font-bold text-gray-800">
            {doctor.patients}
          </div>

          <div className="text-xs text-gray-500">Patients</div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
