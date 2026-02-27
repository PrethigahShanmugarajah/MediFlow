// MediFlow / Client / src / components / DetailPageLoader.jsx
import { ClipLoader } from "react-spinners";

const DetailPageLoader = ({ size = 50, bgClass = "bg-white" }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="flex items-center justify-center -mt-60">
        <ClipLoader size={size} color="#6366F1" />
      </div>
    </div>
  );
};

export default DetailPageLoader;
