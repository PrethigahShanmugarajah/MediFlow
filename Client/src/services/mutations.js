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

/* -------- Create Service Appointment -------- */
export const createServiceAppointment = async ({ payload, token }) => {
  if (!payload) throw new Error("Service Appointment payload is required.");
  if (!token) throw new Error("Authentication token is required.");

  try {
    const response2 = await api.post(
      API_ROUTES.SERVICEAPPOINTMENTS.SERVICEAPPOINTMENTS_CREATE,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data2 = response2.data;
    console.log("Create Service Appointment API Response:", data2);

    if (data2?.success) {
      toast.success(data2?.message);
      console.log("Create Service Appointment Success:", data2?.message);
    } else {
      toast.warn(data2?.message || "Create service appointment with warning");
      console.warn(
        "Create Service Appointment Warning:",
        data2?.message || "Create Service Appointment with warning",
      );
    }

    return data2;
  } catch (error2) {
    toast.error(error2?.response?.data?.message || error2?.message);
    console.error("Create Service Appointment Error:", error2);

    throw error2;
  }
};

/* -------- Login Doctor -------- */
export const loginDoctor = async ({ email, password }) => {
  try {
    const response3 = await api.post(API_ROUTES.DOCTORS.DOCTOR_LOGIN, {
      email,
      password,
    });

    const data3 = response3.data;
    console.log("Login Doctor API Response:", data3);

    if (data3?.success) {
      toast.success(data3?.message);
      console.log("Login Doctor Success:", data3?.message);
    } else {
      toast.warn(data3?.message || "Login doctor with warning");
      console.warn(
        "Login Doctor Warning:",
        data3?.message || "Login Doctor with warning",
      );
    }

    return data3;
  } catch (error3) {
    toast.error(error3?.response?.data?.message || error3?.message);
    console.error("Login Doctor Error:", error3);

    throw error3;
  }
};
