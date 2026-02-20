// MediFlow / Client / src / components / HomeDoctors / HomeDoctors.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Medal, MousePointer2Off } from "lucide-react";
import "./HomeDoctors.css";
import { fetchDoctors } from "../../services/fetch";

const HomeDoctors = ({ previewCount = 8 }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDoctors() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchDoctors();

        const list =
          data?.data || data?.doctors || data?.items || data?.result || [];

        const normalized = (Array.isArray(list) ? list : []).map((d) => {
          const id = d._id || d.id;
          const image =
            d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";
          const available =
            (typeof d.availability === "string"
              ? d.availability.toLowerCase() === "available"
              : typeof d.available === "boolean"
                ? d.available
                : d.availability === true) || d.availability === "Available";

          return {
            id,
            name: d.name || "Unknown",
            specialization: d.specialization || "",
            image,
            experience:
              d.experience || d.experience === 0 ? String(d.experience) : "",
            fee: d.fee ?? d.price ?? 0,
            available,
            raw: d,
          };
        });

        if (!mounted) return;
        setDoctors(normalized);
      } catch (error) {
        if (!mounted) return;
        console.error("load doctors error:", error);
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Network error while loading doctors.",
        );

        setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDoctors();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-10 bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif italic text-gray-900">
            Our{" "}
            <span className="text-indigo-600 font-semibold">Medical Team</span>
          </h1>

          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Book appointments quickly with our verfied specialists.
          </p>
        </div>

        {/* -------- Error --------  */}
        {error ? (
          <div className="text-center mb-6">
            <div className="text-sm text-red-600 mb-2">{error}</div>
            <button
              onClick={() => {
                setLoading(true);
                setError("");
                (async () => {
                  setLoading(true);
                  setError("");
                  try {
                    const data = await fetchDoctors();

                    const items =
                      data?.data || data?.doctors || data?.items || [];

                    const normalized = (Array.isArray(items) ? items : []).map(
                      (d) => {
                        const id = d._id || d.id;
                        const image = d.imageUrl || d.image || "";
                        const available =
                          (typeof d.availability === "string"
                            ? d.availability.toLowerCase() === "available"
                            : typeof d.available === "boolean"
                              ? d.available
                              : d.availability === true) ||
                          d.availability === "Available";

                        return {
                          id,
                          name: d.name || "Unknown",
                          specialization: d.specialization || "",
                          image,
                          experience: d.experience || "",
                          fee: d.fee ?? d.price ?? 0,
                          available,
                          raw: d,
                        };
                      },
                    );

                    setDoctors(normalized);
                    setError("");
                  } catch (error) {
                    console.error(error);
                    setError(
                      error?.response?.data?.message ||
                        "Network error while loading doctors.",
                    );
                    setDoctors([]);
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
              className="px-4 py-2 rounded-full bg-indigo-600 text-white"
            >
              Retry
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: previewCount }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-3xl shadow-md p-4 h-72"
              >
                <div className="bg-indigo-100 rounded-lg h-40 mb-4"></div>
                <div className="h-5 bg-indigo-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-indigo-100 rounded w-1/2 mb-3"></div>

                <div className="flex gap-2 mt-auto">
                  <div className="h-8 w-full bg-indigo-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {doctors.slice(0, previewCount).map((doctor) => (
              <article
                key={doctor.id || doctor.name}
                className="group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition transform duration-300 overflow-hidden"
              >
                {doctor.available ? (
                  <Link
                    to={`doctors/${doctor.id}`}
                    state={{ doctor: doctor.raw || doctor }}
                  >
                    <div className="relative h-60 sm:h-44 md:h-48 lg:h-52 overflow-hidden rounded-t-3xl">
                      <img
                        src={doctor.image || "/placeholder-doctor.jpg"}
                        alt={doctor.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transform transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-doctor.jpg";
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="relative h-60 sm:h-44 md:h-48 lg:h-52 overflow-hidden rounded-t-3xl opacity-80 cursor-not-allowed">
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transform transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-doctor.jpg";
                      }}
                    />

                    <div className="absolute top-3 left-3 bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full shadow">
                      Not available
                    </div>
                  </div>
                )}

                {/* -------- Body -------- */}
                <div className="p-3 sm:p-4 md:p-5 font-serif">
                  <h3
                    className="text-base sm:text-lg md:text-sm lg:text-md xl:text-xl font-semibold text-black"
                    id={`doctor-${doctor.id}-name`}
                  >
                    {doctor.name}
                  </h3>

                  <p className="text-sm sm:text-sm md:text-sm text-indigo-600 font-medium mt-1">
                    {doctor.specialization}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2 border border-blue-300 bg-blue-100 px-2 py-1 rounded-full text-xs sm:text-sm">
                      <Medal className="w-3 h-4" />
                      <span>{doctor.experience} years Experience</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full">
                      {doctor.available ? (
                        <Link
                          to={`/doctors/${doctor.id}`}
                          state={{ doctor: doctor.raw || doctor }}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm bg-linear-to-br from-indigo-300 to-fuchsia-500 text-white hover:shadow-lg"
                        >
                          <ChevronRight className="w-5 h-5" /> Book Now
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-full font-medium bg-gray-300 text-gray-600 cursor-not-allowed text-sm"
                        >
                          <MousePointer2Off className="w-5 h-5" /> Not Available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeDoctors;
