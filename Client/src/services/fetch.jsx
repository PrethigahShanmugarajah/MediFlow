// MediFlow / Client / src / services / fetch.jsx
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";

/* -------- Fetch Doctors -------- */
export async function fetchDoctors(params = {}) {
  try {
    const response1 = await api.get(API_ROUTES.DOCTORS.DOCTORS_GET, { params });

    console.log("Fetch Doctors API Response:", response1);
    const data1 = response1.data;

    if (data1?.success) {
      // toast.success(data1?.message);
      console.log("Fetch Doctors Success:", data1?.message);
    } else {
      toast.warn(data1?.message || "Doctors fetched with warnings");
      console.warn("Fetch Doctors Warning:", data1?.message);
    }

    return data1;
  } catch (error1) {
    toast.error(error1?.response?.data?.message || error1?.message);
    console.error("Fetch Doctors Error:", error1);

    throw error1;
  }
}
