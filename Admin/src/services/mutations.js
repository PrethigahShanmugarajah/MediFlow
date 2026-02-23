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
        data1?.message || "Create doctor with warning",
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
        data2?.message || "Delete doctor with warning",
      );
    }

    return data2;
  } catch (error2) {
    toast.error(error2?.response?.data?.message || error2?.message);
    console.error("Delete Doctor Error:", error2);

    throw error2;
  }
};
