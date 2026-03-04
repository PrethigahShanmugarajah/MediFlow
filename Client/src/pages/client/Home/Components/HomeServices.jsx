// MediFlow / Client / src / pages / Home / Components / HomeServices.jsx
import { useEffect, useState } from "react";
import { Banknote } from "lucide-react";
import "../Home.css";
import { fetchHomeServicesApi } from "../Service/HomeService";
import ClientTitle from "../../../../components/client/ClientTitle";
import ApiError from "../../../../components/common/ApiError";
import AvatarSkeletonCard from "../../../../components/common/AvatarSkeletonCard";
import AvatarCard from "../../../../components/common/AvatarCard";
import { formatServiceName } from "../../../../utils/client/homeUtils";
import { CURRENCY } from "../../../../utils/client/helpers";
import { NoImage } from "../../../../assets";

const HomeServices = ({ previewCount = 8 }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomeServicesApi(setServices, setError, setLoading);
  }, []);

  const retry = () => {
    fetchHomeServicesApi(setServices, setError, setLoading);
  };

  const preview = services.slice(0, previewCount);

  return (
    <section className="py-10 bg-linear-to-br from-indigo-100 via-white to-blue-100 border-b border-indigo-200">
      <div className="homesers-max-w mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <ClientTitle
            title="Our Medical Services"
            description="Choose from our trusted lab tests and healthcare services"
          />
        </div>

        <ApiError message={error} onRetry={retry} />

        {loading ? (
          <AvatarSkeletonCard count={previewCount} imageVariant="rectangle" />
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 ${
              preview.length === 0 ? "opacity-70" : "opacity-100"
            }`}
          >
            {preview.length > 0 &&
              preview.map((service, index) => (
                <div
                  key={service.id || `${service.name}-${index}`}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <AvatarCard
                    imageVariant="rectangle"
                    id={service.id}
                    name={formatServiceName(service.name)}
                    subtitle={service.description}
                    image={service.image}
                    available={service.available}
                    linkTo={`/services/${service.id}`}
                    stateObj={{ service: service.raw || service }}
                    badgeIcon={Banknote}
                    badgeText={`${CURRENCY} ${service.price}`}
                    placeholderImage={NoImage}
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

export default HomeServices;
