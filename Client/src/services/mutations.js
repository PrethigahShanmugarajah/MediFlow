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

/* -------- Update Appointment -------- */
export const updateAppointment = async (id, updates = {}) => {
  try {
    const response4 = await api.put(
      API_ROUTES.APPOINTMENTS.APPOINTMENT_UPDATE(id),
      updates,
    );

    const data4 = response4.data;
    console.log("Update Appointment API Response:", data4);

    if (data4?.success) {
      toast.success(data4?.message);
      console.log("Update Appointment Success:", data4?.message);
    } else {
      toast.warn(data4?.message || "Update appointment with warning");
      console.warn(
        "Update Appointment Warning:",
        data4?.message || "Update Appointment with warning",
      );
    }

    return data4;
  } catch (error4) {
    toast.error(error4?.response?.data?.message || error4?.message);
    console.error("Update Appointment Error:", error4);

    throw error4;
  }
};

/* -------- Update Doctor -------- */
export const updateDoctor = async (id, formData, token) => {
  try {
    const response5 = await api.put(
      API_ROUTES.DOCTORS.DOCTOR_UPDATE(id),
      formData,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    const data5 = response5.data;
    console.log("Update Doctor API Response:", data5);

    if (data5?.success) {
      toast.success(data5?.message);
      console.log("Update Doctor Success:", data5?.message);
    } else {
      toast.warn(data5?.message || "Update doctor with warning");
      console.warn(
        "Update Doctor Warning:",
        data5?.message || "Update Doctor with warning",
      );
    }

    return data5;
  } catch (error5) {
    toast.error(error5?.response?.data?.message || error5?.message);
    console.error("Update Doctor Error:", error5);

    throw error5;
  }
};

/* -------- Change Doctor Availability -------- */
export const changeDoctorAvailability = async (id, token) => {
  try {
    const response6 = await api.post(
      API_ROUTES.DOCTORS.DOCTOR_TOGGLE_AVAILABILITY(id),
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    const data6 = response6.data;
    console.log("Change Doctor Availability API Response:", data6);

    if (data6?.success) {
      toast.success(data6?.message);
      console.log("Change Doctor Availability Success:", data6?.message);
    } else {
      toast.warn(data6?.message || "Change doctor availability with warning");
      console.warn(
        "Change Doctor Availability Warning:",
        data6?.message || "Change Doctor Availability with warning",
      );
    }

    return data6;
  } catch (error6) {
    toast.error(error6?.response?.data?.message || error6?.message);
    console.error("Change Doctor Availability Error:", error6);

    throw error6;
  }
};
