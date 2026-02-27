// MediFlow / Client / src / pages / Home / Components / HomeDoctors.jsx
import { useEffect, useState } from "react";
import { Medal } from "lucide-react";
import { fetchDoctorsApi } from "../Service/HomeService";
import "../Home.css";
import Title from "../../../components/Title";
import AvatarCard from "../../../components/AvatarCard";
import AvatarSkeletonCard from "../../../components/AvatarSkeletonCard";
import ApiError from "../../../components/ApiError";
import { NoPersonImage } from "../../../assets";
import { formatDoctorName } from "../../../utils/homeUtils";

const HomeDoctors = ({ previewCount = 8 }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctorsApi(setDoctors, setError, setLoading);
  }, []);

  const preview = doctors.slice(0, previewCount);

  const retry = () => {
    fetchDoctorsApi(setDoctors, setError, setLoading);
  };

  return (
    <section className="py-10 bg-linear-to-br from-blue-100 via-white to-indigo-100 border-b border-indigo-200">
      <div className="homedocs-max-w mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Title
            title="Our Medical Team"
            description="Book appointments quickly with our verfied specialiests"
          />
        </div>

        <ApiError message={error} onRetry={retry} />

        {loading ? (
          <AvatarSkeletonCard count={previewCount} />
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 ${
              preview.length === 0 ? "opacity-70" : "opacity-100"
            }`}
          >
            {preview.length > 0 &&
              preview.map((doctor, index) => (
                <div
                  key={doctor.id || `${doctor.name}-${index}`}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <AvatarCard
                    id={doctor.id}
                    name={formatDoctorName(doctor.name)}
                    subtitle={doctor.specialization}
                    image={doctor.image}
                    available={doctor.available}
                    linkTo={`/doctors/${doctor.id}`}
                    stateObj={{ doctor: doctor.raw || doctor }}
                    badgeIcon={Medal}
                    badgeText={`${doctor.experience || "-"} years Experience`}
                    placeholderImage={NoPersonImage}
                    buttonText="Book Now"
                    notAvailableText="Not Available"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeDoctors;
