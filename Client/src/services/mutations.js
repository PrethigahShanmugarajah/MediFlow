// MediFlow / Client / src / services / mutations.js
import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

/* -------- Create Appointment -------- */
export const createAppointment = async ({ payload, token }) => {
  try {
    if (!payload) throw new Error("Appointment payload is required.");
    if (!token) throw new Error("Authentication token is required.");

    const response1 = await api.post(
      API_ROUTES.APPOINTMENTS.APPOINTMENT_CREATE,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data1 = response1.data;
    console.log("Create Appointment API Response:", data1);

    if (data1?.success) {
      toast.success(data1?.message);
      console.log("Create Appointment Success:", data1?.message);
    } else {
      toast.warn(data1?.message || "Create appointment with warning");
      console.warn(
        "Create Appointment Warning:",
        data1?.message || "Create Appointment with warning",
      );
    }

    return data1;
  } catch (error1) {
    toast.error(error1?.response?.data?.message || error1?.message);
    console.error("Create Appointment Error:", error1);

    throw error1;
  }
};
