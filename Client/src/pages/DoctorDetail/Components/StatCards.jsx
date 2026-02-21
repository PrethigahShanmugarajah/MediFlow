// MediFlow / Client / src / pages / DoctorDetail / Components / StatCards.jsx
import { Award, Heart, Users } from "lucide-react";

const StatCards = ({ doctor }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-4 w-full max-w-lg px-2">
      <div className="text-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg border border-emerald-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <Heart className="w-5 h-5 mx-auto mb-2 text-red-500" />
        <div className="text-lg font-bold text-gray-800">{doctor.success}%</div>
        <div className="text-xs text-gray-500">Success</div>
      </div>

      <div className="text-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg border border-emerald-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <Award className="w-5 h-5 mx-auto mb-2 text-violet-500" />
        <div className="text-lg font-bold text-gray-800">
          {doctor.experience} Years
        </div>
        <div className="text-xs text-gray-500">Experience</div>
      </div>

      <div className="text-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg border border-emerald-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <Users className="w-5 h-5 mx-auto mb-2 text-indigo-500" />
        <div className="text-lg font-bold text-gray-800">{doctor.patients}</div>
        <div className="text-xs text-gray-500">Patients</div>
      </div>
    </div>
  );
};

export default StatCards;
