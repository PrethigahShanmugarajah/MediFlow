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
