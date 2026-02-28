// MediFlow / Client / src / pages / Service / Service.jsx
import { useEffect, useMemo, useState } from "react";
import { NoImage } from "../../assets";
import Title from "../../components/Title";
import AvatarCard from "../../components/AvatarCard";
import AvatarSkeletonCard from "../../components/AvatarSkeletonCard";
import { fetchServicesApi } from "./Service/ServiceService";
import SearchField from "../../components/SearchField";
import ApiError from "../../components/ApiError";
import ShowMoreButton from "../../components/ShowMoreButton";
import { formatServiceName } from "../../utils/serviceUtils";

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchServicesApi(setServices, setError, setLoading);
  }, []);

  const filteredServices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return services;

    return services.filter(
      (service) =>
        (service.name || "").toLowerCase().includes(q) ||
        (service.shortDescription || "").toLowerCase().includes(q),
    );
  }, [services, searchTerm]);

  const displayedServices = showAll
    ? filteredServices
    : filteredServices.slice(0, 8);

  const retry = () => fetchServicesApi(setServices, setError, setLoading);

  useEffect(() => {
    setShowAll(false);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-white to-indigo-100 py-8 sm:py-10 px-3 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 font-serif">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <Title
            title="Comprehensive Health Diagnostics"
            description="Accurate testing services focused on safety and trusted results."
          />
        </div>

        <div className="flex justify-center mb-8 sm:mb-12 animate-slide-up">
          <div className="w-full max-w-xl px-2 sm:px-0">
            <SearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search services by name or description..."
              size="l"
              widthClass=""
              showClear
              inputClassName=""
              className="rounded-full border border-indigo-300"
            />
          </div>
        </div>

        <ApiError message={error} onRetry={retry} />

        {loading ? (
          <AvatarSkeletonCard
            count={8}
            imageVariant="rectangle"
            columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          />
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 ${
              filteredServices.length === 0 ? "opacity-70" : "opacity-100"
            }`}
          >
            {displayedServices.length > 0
              ? displayedServices.map((service, index) => (
                  <div
                    key={service.id || `${service.name}-${index}`}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <AvatarCard
                      imageVariant="rectangle"
                      id={service.id}
                      name={formatServiceName(service.name)}
                      subtitle={service.shortDescription}
                      image={service.image}
                      available={service.available}
                      linkTo={`/services/${service.id}`}
                      stateObj={{ service: service.raw || service }}
                      placeholderImage={NoImage}
                      buttonText="Book Now"
                      notAvailableText="Not Available"
                    />
                  </div>
                ))
              : !error && (
                  <div className="col-span-full text-center py-10 text-indigo-800 font-medium text-base animate-fade-in">
                    {searchTerm.trim()
                      ? "No services found matching your search criteria."
                      : "No services available right now."}
                  </div>
                )}
          </div>
        )}

        <ShowMoreButton
          id="services-show-more"
          total={filteredServices.length}
          limit={8}
          showAll={showAll}
          onToggle={() => setShowAll((v) => !v)}
          wrapperClassName="mt-8 sm:mt-15"
          moreText="Show More"
          lessText="Hide"
          showRemainingCount
          showIcon
        />
      </div>
    </div>
  );
};

export default Service;
