// MediFlow / Admin / src / services / fetch.js
import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

/* -------- Fetch Registered User Count -------- */
export const fetchRegisteredUserCount = async () => {
  try {
    const response1 = await api.get(
      API_ROUTES.APPOINTMENTS.APPOINTMENTS_GET_REGISTERED_USERCOUNT,
    );

    const data1 = response1.data;
    console.log("Fetch RegisteredUser Count API Response:", data1);

    if (data1?.success) {
      // toast.success(data1?.message);
      console.log("Get RegisteredUser Count Success:", data1);
    } else {
      toast.warn(data1?.message || "Fetch registered user count with warning");
      console.warn(
        "Fetch RegisteredUser Count Warning:",
        data1?.message || " Fetch registered user count with warning",
      );
    }

    return data1;
  } catch (error1) {
    toast.error(error1?.response?.data?.message || error1?.message);
    console.error("Fetch RegisteredUser Count Error:", error1);

    throw error1;
  }
};

/* -------- Fetch Doctors -------- */
export const fetchDoctors = async (params) => {
  try {
    const response2 = await api.get(API_ROUTES.DOCTORS.DOCTORS_GET, { params });

    const data2 = response2.data;
    console.log("Fetch Doctors API Response:", data2);

    if (data2?.success) {
      // toast.success(data2?.message);
      console.log("Fetch Doctors Success:", data2);
    } else {
      toast.warn(data2?.message || "Fetch Doctors with warning");
      console.warn(
        "Fetch Doctors Warning:",
        data2?.message || "Fetch Doctors with warning",
      );
    }

    return data2;
  } catch (error2) {
    toast.error(error2?.response?.data?.message || error2?.message);
    console.error("Fetch Doctors Error:", error2);

    throw error2;
  }
};
