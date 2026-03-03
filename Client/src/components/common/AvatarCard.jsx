// MediFlow / Client / src / components / common / AvatarCard.jsx
import { ChevronRight, MousePointer2Off } from "lucide-react";
import { Link } from "react-router-dom";

const AvatarCard = ({
  id,
  name,
  subtitle,
  image,
  available,
  linkTo,
  stateObj,
  badgeIcon: BadgeIcon,
  badgeText,
  placeholderImage,
  notAvailableText = "Not Available",
  buttonText = "Book Now",
  imageVariant = "circle",
}) => {
  const isCircle = imageVariant === "circle";

  return (
    <div
      className={`group bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 md:p-6 text-center transition-all duration-300 hover:shadow-xl animate-fade-in-up border border-indigo-100 ${
        !available ? "opacity-70" : ""
      }`}
      role="article"
    >
      {available ? (
        <Link
          to={linkTo}
          state={stateObj}
          className={`focus:outline-none focus:ring-2 focus:ring-indigo-300 inline-block w-full ${
            isCircle ? "rounded-full" : "rounded-2xl"
          }`}
        >
          <div
            className={`${
              isCircle
                ? "relative mx-auto mb-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36"
                : "relative -mt-4 sm:-mt-5 md:-mt-6 mb-4 -mx-4 sm:-mx-5 md:-mx-6 w-auto h-40 sm:h-48 md:h-56 lg:h-60 overflow-hidden rounded-t-3xl"
            }`}
          >
            <img
              src={image || placeholderImage}
              alt={name}
              loading="lazy"
              className={`${
                isCircle
                  ? "w-full h-full rounded-full object-cover border-4 border-indigo-200 shadow-lg transition-transform duration-500 hover:scale-105"
                  : "w-full h-full rounded-t-3xl object-cover object-center transition-transform duration-500 group-hover:scale-105"
              }`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>
        </Link>
      ) : (
        <div
          className={`opacity-90 cursor-not-allowed ${
            isCircle
              ? "relative mx-auto mb-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36"
              : "relative -mt-4 sm:-mt-5 md:-mt-6 mb-4 -mx-4 sm:-mx-5 md:-mx-6 w-auto h-40 sm:h-48 md:h-56 lg:h-60 overflow-hidden rounded-t-3xl"
          }`}
          aria-disabled="true"
        >
          <img
            src={image || placeholderImage}
            alt={name}
            loading="lazy"
            className={`${
              isCircle
                ? "w-full h-full rounded-full object-cover border-4 border-gray-300 shadow-md"
                : "w-full h-full rounded-t-3xl object-cover object-center"
            }`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholderImage;
            }}
          />
        </div>
      )}

      <h3 className="text-base sm:text-lg md:text-base lg:text-lg font-bold text-indigo-900 mb-1 truncate">
        {name}
      </h3>

      {!!subtitle && (
        <p className="text-sm text-indigo-600 font-medium mb-3 truncate">
          {subtitle}
        </p>
      )}

      {!!badgeText && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-indigo-50 border border-indigo-300 shadow-sm">
          {BadgeIcon ? <BadgeIcon className="w-4 h-4" /> : null}
          <span>{badgeText}</span>
        </div>
      )}

      {available ? (
        <Link
          to={linkTo}
          state={stateObj}
          className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-full font-medium transition-all duration-300 text-sm bg-linear-to-br from-indigo-500 to-cyan-500 text-white hover:shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
          {buttonText}
        </Link>
      ) : (
        <button
          disabled
          className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-full font-medium bg-gray-300 text-gray-600 cursor-not-allowed text-sm"
        >
          <MousePointer2Off className="w-5 h-5" />
          {notAvailableText}
        </button>
      )}
    </div>
  );
};

export default AvatarCard;
