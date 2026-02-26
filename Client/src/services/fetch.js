// MediFlow / Client / src / services / fetch.js
import api from "../api/axios";
import API_ROUTES from "../api/api_route";
import { toast } from "react-toastify";

/* -------- Fetch Doctors -------- */
export const fetchDoctors = async (params) => {
  try {
    const response1 = await api.get(API_ROUTES.DOCTORS.DOCTORS_GET, {
      params,
    });

    const data1 = response1.data;
    console.log("Fetch Doctors API Response:", data1);

    if (data1?.success) {
      // toast.success(data1?.message);
      console.log("Fetch Doctors Success:", data1?.message);
    } else {
      toast.warn(data1?.message || "Fetch doctors with warning");
      console.warn(
        "Fetch Doctors Warning:",
        data1?.message || "Fetch Doctors with warning",
      );
    }

    return data1;
  } catch (error1) {
    toast.error(error1?.response?.data?.message || error1?.message);
    console.error("Fetch Doctors Error:", error1);

    throw error1;
  }
};

/* -------- Fetch Services -------- */
export const fetchServices = async () => {
  try {
    const response2 = await api.get(API_ROUTES.SERVICES.SERVICES_GET);

    const data2 = response2.data;
    console.log("Fetch Services API Response:", data2);

    if (data2?.success) {
      // toast.success(data2?.message);
      console.log("Fetch Services Success:", data2?.message);
    } else {
      toast.warn(data2?.message || "Fetch services with warning");
      console.warn(
        "Fetch Services Warning:",
        data2?.message || "Fetch Services with warning",
      );
    }

    return data2;
  } catch (error2) {
    toast.error(error2?.response?.data?.message || error2?.message);
    console.error("Fetch Services Error:", error2);

    throw error2;
  }
};
