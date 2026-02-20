// MediFlow / Client / src / components / Banner / Banner.jsx
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Hospital,
  Phone,
  Ribbon,
  ShieldUser,
  Star,
  Users,
} from "lucide-react";
import BannerImg from "../../assets/BannerImg.png";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-7xl mx-auto my-12 px-4">
      <div className="relative rounded-3xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 rounded-3xl p-0.75 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-400 via-indigo-500 to-blue-400 animate-[spin_3s_linear_infinite] opacity-80"></div>
          <div className="absolute inset-0.5 rounded-3xl bg-white"></div>
        </div>

        <div className="relative z-20 p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mb-4 lg:mb-6 gap-4">
                <div className="relative">
                  <div className="relative bg-linear-to-br from-blue-300 to-indigo-600 p-3 rounded-full shadow-lg transform rotate-0 hover:-rotate-6 transition-transform duration-300 cursor-pointer">
                    <Hospital className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="font-[pacifico]">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-1">
                    Medi{" "}
                    <span className="text-transparent bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text">
                      Flow+
                    </span>
                  </h1>

                  {/* -------- Starts -------- */}
                  <div className="flex items-center justify-center lg:justify-start mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          className="w-4 h-4 fill-lime-400 text-lime-400"
                          key={star}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* -------- Tagline -------- */}
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-700 mb-5 leading-tight">
                Premium Healthcare{" "}
                <span className="block text-blue-600 font-semibold">
                  At Your Fingertips
                </span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm sm:text-base">
                <div
                  className={`flex items-center justify-center lg:justify-start bg-linear-to-br from-blue-500 to-blue-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-blue-100`}
                >
                  <Ribbon className="w-5 h-5 text-white mr-3" />
                  <span className="text-gray-700 font-medium">
                    Certified Specialists
                  </span>
                </div>

                <div className="flex items-center justify-center lg:justify-start bg-linear-to-br from-blue-500 to-blue-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-green-100">
                  <Clock className="w-5 h-5 text-white mr-3" />
                  <span className="text-gray-700 font-medium">
                    24/7 Availability
                  </span>
                </div>

                <div className="flex items-center justify-center lg:justify-start bg-linear-to-br from-blue-500 to-blue-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-indigo-100">
                  <ShieldUser className="w-5 h-5 text-white mr-3" />
                  <span className="text-gray-700 font-medium">
                    Safe &amp; Secure
                  </span>
                </div>

                <div className="flex items-center justify-center lg:justify-start bg-linear-to-br from-blue-500 to-blue-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-zinc-100">
                  <Users className="w-5 h-5 text-white mr-3" />
                  <span className="text-gray-700 font-medium">
                    500+ Doctors
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/doctors")}
                  className="group relative lg:whitespace-nowrap bg-linear-to-r from-blue-500 to-indigo-300 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold transform transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden text-sm sm:text-base"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                    <span>Book Appointment Now</span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `tel:${import.meta.env.VITE_EMERGENCY_PHONE}`)
                  }
                  className="group border-2 lg:whitespace-nowrap border-rose-400 text-rose-600 bg-rose-300 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold transform transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:bg-rose-400/80 text-sm sm:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Emergency Call</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex-1 relative w-full">
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative transform transition-transform duration-500 overflow-hidden rounded-xl">
                  <img
                    src={BannerImg}
                    alt="Banner"
                    className="w-full object-cover h-56 sm:h-72 md:h-96 lg:h-90 xl:h-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
