// MediFlow / Admin / src / services / fetch.jsx
import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

export async function fetchDoctors(params = {}) {
  try {
    const response1 = await api.get(API_ROUTES.DOCTORS.DOCTORS_GET, { params });

    console.log("Fetch Doctors API Response:", response1);
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

    console.log("Fetch Patient Count API Response:", response2);
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

export async function fetchAppointments(params = {}) {
  try {
    const response3 = await api.get(API_ROUTES.APPOINTMENT.APPOINTMENT_GET, {
      params,
    });

    console.log("Fetch Appointments API Response:", response3);
    const data3 = response3.data;

    if (data3?.success) {
      // toast.success(data3?.message);
      console.log("Fetch Appointments Success:", data3?.message);
    } else {
      toast.warn(data3?.message || "Patient count fetched with warning");
      console.warn("Fetch Appointments Warning:", data3?.message);
    }

    return data3;
  } catch (error3) {
    toast.error(error3?.response?.data?.message || error3?.message);
    console.error("Fetch Appointments Error:", error3);

    throw error3;
  }
}

export async function fetchServiceAppointmentsStats() {
  try {
    const response4 = await api.get(
      API_ROUTES.SERVICEAPPOINTMENT.SERVICEAPPOINTMENT_GET_STATS,
    );

    console.log("Fetch Service Appointments Stat API Response:", response4);
    const data4 = response4.data;

    if (data4?.success) {
      // toast.success(data4?.message);
      console.log("Fetch Service Appointments Stat Success:", data4?.message);
    } else {
      toast.warn(
        data4?.message || "Fetch Service Appointments Stat with warning",
      );
      console.warn("Fetch Service Appointments Stat Warning:", data4?.message);
    }

    return data4;
  } catch (error4) {
    toast.error(error4?.response?.data?.message || error4?.message);
    console.error("Fetch Service Appointments Stat Error:", error4);

    throw error4;
  }
}

export async function fetchServiceById(id) {
  if (!id) throw new Error("Service id is required");

  try {
    const response5 = await api.get(API_ROUTES.SERVICE.SERVICE_GET(id));

    console.log("Fetch Service API Response:", response5);
    const data5 = response5.data;

    if (data5?.success) {
      // toast.success(data5?.message);
      console.log("Fetch Service Success:", data5?.message);
    } else {
      toast.warn(data5?.message || "Fetch Service with warning");
      console.warn("Fetch Service Warning:", data5?.message);
    }

    return data5;
  } catch (error5) {
    toast.error(error5?.response?.data?.message || error5?.message);
    console.error("Fetch Service Error:", error5);

    throw error5;
  }
}
