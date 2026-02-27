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

/* -------- Fetch Doctor By ID -------- */
export const fetchDoctorByID = async (id) => {
  try {
    if (!id) throw new Error("Doctor ID is required.");

    const response3 = await api.get(API_ROUTES.DOCTORS.DOCTOR_GET(id));

    const data3 = response3.data;
    console.log("Fetch Doctor API Response:", data3);

    if (data3?.success) {
      // toast.success(data3?.message);
      console.log("Fetch Doctor Success:", data3?.message);
    } else {
      toast.warn(data3?.message || "Fetch doctor with warning");
      console.warn(
        "Fetch Doctor Warning:",
        data3?.message || "Fetch Doctor with warning",
      );
    }

    return data3;
  } catch (error3) {
    toast.error(error3?.response?.data?.message || error3?.message);
    console.error("Fetch Doctor Error:", error3);

    throw error3;
  }
};

/* -------- Fetch Booked Slots -------- */
export const fetchBookedSlots = async (doctorId, dateISO) => {
  try {
    if (!doctorId || !dateISO) return null;

    const response4 = await api.get(
      API_ROUTES.APPOINTMENTS.APPOINTMENTS_GET_SLOTS_BYDOCTOR(doctorId),
      { params: { date: dateISO } },
    );

    const data4 = response4.data;
    console.log("Fetch Booked Slots API Response:", data4);

    if (data4?.success) {
      // toast.success(data4?.message);
      console.log("Fetch Booked Slots Success:", data4?.message);
    } else {
      toast.warn(data4?.message || "Fetch booked slots with warning");
      console.warn(
        "Fetch Booked Slots Warning:",
        data4?.message || "Fetch Booked Slots with warning",
      );
    }

    return data4;
  } catch (error4) {
    toast.error(error4?.response?.data?.message || error4?.message);
    console.error("Fetch Booked Slots Error:", error4);

    throw error4;
  }
};
