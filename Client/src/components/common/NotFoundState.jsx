// MediFlow / Client / src / components / common / NotFoundState.jsx
import { Link } from "react-router-dom";

const NotFoundState = ({
  icon: Icon,
  title = "Not Found",
  backText = "Back",
  backTo = "/",
  bgClass = "bg-white",
  iconColor = "text-indigo-500",
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="text-center">
        {Icon && (
          <div className="mb-4 flex justify-center">
            <Icon size={64} strokeWidth={1.5} className={iconColor} />
          </div>
        )}

        <h1 className="text-2xl font-bold text-black">{title}</h1>

        {backText && backTo && (
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all"
          >
            {backText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFoundState;
