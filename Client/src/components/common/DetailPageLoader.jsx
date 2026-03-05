// MediFlow / Client / src / components / common / DetailPageLoader.jsx
import { ClipLoader } from "react-spinners";

const DetailPageLoader = ({ bgClass, fullPage = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullPage ? `min-h-screen ${bgClass || ""}` : "py-20"
      }`}
    >
      <ClipLoader size={50} color="#6366F1" />
    </div>
  );
};

export default DetailPageLoader;
