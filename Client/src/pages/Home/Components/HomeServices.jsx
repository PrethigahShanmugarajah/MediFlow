// MediFlow / Client / src / pages / Home / Components / HomeServices.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MousePointer2Off, BadgeDollarSign } from "lucide-react";
import "../Home.css";
import Title from "../../../components/Title";
import { fetchHomeServicesApi } from "../Service/HomeService";

const HomeServices = ({ previewCount = 8 }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomeServicesApi(setServices, setError, setLoading);
  }, []);

  const preview = services.slice(0, previewCount);

  return (
    <section className="py-10 bg-linear-to-br from-indigo-100 via-white to-blue-100 border-b border-indigo-200">
      <div className="homesers-max-w mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Title
            title="Our Medical Services"
            description="Choose from our trusted lab tests and healthcare services"
          />
        </div>

        {/* -------- Error -------- */}
        {error ? (
          <div className="text-center mb-6">
            <div className="text-sm text-red-600 mb-2">{error}</div>
            <button
              onClick={() =>
                fetchHomeServicesApi(setServices, setError, setLoading)
              }
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
                className="animate-pulse bg-white rounded-3xl homesers-shadow-md p-4 h-72"
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
          /* -------- Cards -------- */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {preview.map((service) => (
              <article
                key={service.id || service.name}
                className="group relative bg-white rounded-3xl homesers-shadow-md hover:homesers-shadow-2xl transition transform duration-300 overflow-hidden"
              >
                {service.available ? (
                  <Link
                    to={`/services/${service.id}`}
                    state={{ service: service.raw || service }}
                  >
                    <div className="relative h-60 sm:h-44 md:h-48 lg:h-52 overflow-hidden rounded-t-3xl">
                      <img
                        src={service.image || "/placeholder-service.jpg"}
                        alt={service.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transform transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-service.jpg";
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="relative h-60 sm:h-44 md:h-48 lg:h-52 overflow-hidden rounded-t-3xl opacity-80 cursor-not-allowed">
                    <img
                      src={service.image || "/placeholder-service.jpg"}
                      alt={service.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transform transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-service.jpg";
                      }}
                    />

                    <div className="absolute top-3 left-3 bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full shadow">
                      Not available
                    </div>
                  </div>
                )}

                {/* -------- Body -------- */}
                <div className="p-3 sm:p-4 md:p-5 font-serif">
                  <h3 className="text-base sm:text-lg md:text-sm lg:text-md xl:text-xl font-semibold text-black">
                    {service.name}
                  </h3>

                  <p className="text-sm sm:text-sm md:text-sm text-indigo-600 font-medium mt-1 line-clamp-1">
                    {service.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2 border border-blue-300 bg-blue-100 px-2 py-1 rounded-full text-xs sm:text-sm">
                      <BadgeDollarSign className="w-4 h-4" />
                      <span>LKR {service.price}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full">
                      {service.available ? (
                        <Link
                          to={`/services/${service.id}`}
                          state={{ service: service.raw || service }}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm bg-linear-to-br from-indigo-500 to-cyan-500 text-white hover:shadow-lg"
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

export default HomeServices;
