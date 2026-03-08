import { Link } from "react-router-dom";
import ApiError from "../common/ApiError";
import { ArrowLeft } from "lucide-react";

const DetailErrorState = ({
  message,
  onRetry,
  backTo = "/",
  backText = "Back",
  bgClass = "bg-white",
}) => {
  if (!message) return null;

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="text-center">
        <ApiError message={message} onRetry={onRetry} retryText="Retry" />

        <Link
          to={backTo}
          className="inline-flex items-center gap-2 mt-0 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-indigo-600 transition-all"
        >
          <ArrowLeft size={20} />
          {backText}
        </Link>
      </div>
    </div>
  );
};

export default DetailErrorState;
