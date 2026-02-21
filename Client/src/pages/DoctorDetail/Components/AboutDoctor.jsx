// MediFlow / Client / src / pages / DoctorDetail / Components / AboutDoctor.jsx
import { BadgeInfo } from "lucide-react";

const AboutDoctor = ({ doctor }) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-indigo-50">
      <div className="flex items-center gap-2 mb-4">
        <BadgeInfo className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-indigo-700">About Doctor</h3>
      </div>

      <p className="text-gray-600 leading-relaxed">
        {doctor.about || doctor.bio}
      </p>
    </div>
  );
};

export default AboutDoctor;
