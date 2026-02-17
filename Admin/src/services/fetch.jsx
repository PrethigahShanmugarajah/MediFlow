// MediFlow / Admin / src / services / fetch.jsx
import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

export async function fetchDoctors(params = {}) {
  try {
    const response1 = await api.get(API_ROUTES.DOCTORS.DOCTORS_GET, { params });
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

export async function fetchPatientCount() {
  try {
    const response2 = await api.get(
      API_ROUTES.APPOINTMENT.APPOINTMENT_GET_REGISTERED_USERCOUNT,
    );

    const data2 = response2.data;

    if (data2?.success) {
      // toast.success(data2?.message);
      console.log("Fetch Patient Count Success:", data2?.message);
    } else {
      toast.warn(data2?.message || "Patient count fetched with warning");
      console.warn("Fetch Patient Count Warning:", data2?.message);
    }

    let count = Number(data2?.count ?? data2?.totalUsers ?? data2?.data ?? 0);

    if (isNaN(count)) count = 0;

    return count;
  } catch (error2) {
    toast.error(error2?.response?.data?.message || error2?.message);
    console.error("Fetch Patient Count Error:", error2);

    throw error2;
  }
}
