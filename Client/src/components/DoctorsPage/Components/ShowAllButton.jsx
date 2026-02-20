// MediFlow / Client / src / components / DoctorsPage / Components / ShowAllButton.jsx
import { CircleChevronDown, CircleChevronUp } from "lucide-react";

const ShowAllButton = ({ showAll, toggle }) => (
  <div className="flex justify-center mt-8 sm:mt-10">
    <button
      onClick={toggle}
      className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-linear-to-r from-indigo-400 to-fuchsia-500 text-white rounded-full text-md font-semibold shadow-md hover:shadow-lg transition-all duration-300"
    >
      {showAll ? (
        <>
          <CircleChevronUp className="w-5 h-5" /> Hide
        </>
      ) : (
        <>
          <CircleChevronDown className="w-5 h-5" /> Show All
        </>
      )}
    </button>
  </div>
);

export default ShowAllButton;
