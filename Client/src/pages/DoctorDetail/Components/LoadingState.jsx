// MediFlow / Client / src / pages / DoctorDetail / Components / LoadingState.jsx
import { PulseLoader } from "react-spinners";

const LoadingState = () => {
  return (
    <div className="col-span-full flex text-center items-center justify-center text-black py-8 gap-3 min-h-screen">
      <PulseLoader size={10} color="#3B82F6" />
      <span className="text-sm">Loading Doctors...</span>
    </div>
  );
};

export default LoadingState;
