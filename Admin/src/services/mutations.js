// MediFlow / Admin / src / services / mutations.js
import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

/* -------- Create Doctor -------- */
export const createDoctor = async (formData) => {
  try {
    const response1 = await api.post(
      API_ROUTES.DOCTORS.DOCTOR_CREATE,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    const data1 = response1.data;
    console.log("Create Doctor API Response:", data1);

    if (data1?.success) {
      toast.success(data1?.message);
      console.log("Create Doctor Success:", data1?.message);
    } else {
      toast.warn(data1?.message || "Create doctor with warning");
      console.warn(
        "Create Doctor Warning:",
        data1?.message || "Create Doctor with warning",
      );
    }

    return data1;
  } catch (error1) {
    toast.error(error1?.response?.data?.message || error1?.message);
    console.error("Create Doctor Error:", error1);

    throw error1;
  }
};

/* -------- Delete Doctor -------- */
export const deleteDoctor = async (id) => {
  try {
    const response2 = await api.delete(API_ROUTES.DOCTORS.DOCTOR_DELETE(id));

    const data2 = response2.data;
    console.log("Delete Doctor API Response:", data2);

    if (data2?.success) {
      toast.success(data2?.message);
      console.log("Delete Doctor Success:", data2?.message);
    } else {
      toast.warn(data2?.message || "Delete doctor with warning");
      console.warn(
        "Delete Doctor Warning:",
        data2?.message || "Delete Doctor with warning",
      );
    }

    return data2;
  } catch (error2) {
    toast.error(error2?.response?.data?.message || error2?.message);
    console.error("Delete Doctor Error:", error2);

    throw error2;
  }
};

/* -------- Cancel Appointment -------- */
export const cancelAppointment = async (id) => {
  try {
    const response3 = await api.post(
      API_ROUTES.APPOINTMENTS.APPOINTMENT_CANCEL(id),
    );

    const data3 = response3.data;
    console.log("Cancel Appointment API Response:", data3);

    if (data3?.success) {
      toast.success(data3?.message);
      console.log("Cancel Appointment Success:", data3?.message);
    } else {
      toast.warn(data3?.message || "Cancel appointment with warning");
      console.warn(
        "Cancel Appointment Warning:",
        data3?.message || "Cancel Appointment with warning",
      );
    }

    return data3;
  } catch (error3) {
    toast.error(error3?.response?.data?.message || error3?.message);
    console.error(error3);

    throw error3;
  }
};

/* -------- Update Service -------- */
export const updateService = async (id, formData) => {
  try {
    const response4 = await api.put(
      API_ROUTES.SERVICES.SERVICE_UPDATE(id),
      formData,
    );

    const data4 = response4.data;
    console.log("Update Service API Response:", data4);

    if (data4?.success) {
      toast.success(data4?.message);
      console.log("Update Service Success:", data4?.message);
    } else {
      toast.warn(data4?.message || "Update service with warning");
      console.warn(
        "Update Service Warning:",
        data4?.message || "Update Service with warning",
      );
    }

    return data4;
  } catch (error4) {
    toast.error(error4?.response?.data?.message || error4?.message);
    console.error(error4);

    throw error4;
  }
};

/* -------- Create Service -------- */
export const createService = async (formData) => {
  try {
    const response5 = await api.post(
      API_ROUTES.SERVICES.SERVICE_CREATE,
      formData,
    );

    const data5 = response5.data;
    console.log("Create Service API Response:", data5);

    if (data5?.success) {
      toast.success(data5?.message);
      console.log("Create Service Success:", data5?.message);
    } else {
      toast.warn(data5?.message || "Create service with warning");
      console.warn(
        "Create Service Warning:",
        data5?.message || "Create Service with warning",
      );
    }

    return data5;
  } catch (error5) {
    toast.error(error5?.response?.data?.message || error5?.message);
    console.error(error5);

    throw error5;
  }
};
