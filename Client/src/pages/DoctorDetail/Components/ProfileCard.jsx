// MediFlow / Client / src / pages / DoctorDetail / Components / ProfileCard.jsx
import { Zap } from "lucide-react";
import AboutDoctor from "./AboutDoctor";
import DoctorInfoGrid from "./DoctorInfoGrid";
import StatCards from "./StatCards";

const ProfileCard = ({ doctor, fee }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 sm:p-8">
        {/* -------- Left Side -------- */}
        <div className="lg:col-span-1 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-2 sm:-inset-3 md:-inset-6 bg-linear-to-br from-indigo-400 to-blue-400 rounded-full blur-lg opacity-50"></div>
            <img
              src={doctor.imageUrl || doctor.image || "/placeholder-doctor.jpg"}
              alt={doctor.name}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full object-cover border-4 sm:border-6 md:border-8 border-white shadow-2xl z-10 transition-transform duration-300"
              style={{ objectPosition: "center" }}
            />
          </div>
          <StatCards doctor={doctor} />
        </div>

        {/* -------- Right Side -------- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-2xl lg:text-3xl xl:text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {doctor.name}
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-400 to-blue-500 text-white rounded-full text-sm font-semibold shadow-lg">
              <Zap className="w-4 h-4" />
              {doctor.specialization ||
                doctor.speciality ||
                doctor.specialization}
            </div>
          </div>

          <DoctorInfoGrid doctor={doctor} fee={fee} />
          <AboutDoctor doctor={doctor} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
