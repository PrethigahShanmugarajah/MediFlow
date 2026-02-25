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
      console.log("Get RegisteredUser Count Success:", data1?.message);
    } else {
      toast.warn(data1?.message || "Fetch registered user count with warning");
      console.warn(
        "Fetch RegisteredUser Count Warning:",
        data1?.message || " Fetch Registered User Count with warning",
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
      console.log("Fetch Doctors Success:", data2?.message);
    } else {
      toast.warn(data2?.message || "Fetch doctors with warning");
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

/* -------- Fetch Appointments -------- */
export const fetchAppointments = async (params) => {
  try {
    const response3 = await api.get(API_ROUTES.APPOINTMENTS.APPOINTMENTS_GET, {
      params,
    });

    const data3 = response3.data;
    console.log("Fetch Doctors API Response:", data3);

    if (data3?.success) {
      // toast.success(data3?.message);
      console.log("Fetch Doctors Success:", data3?.message);
    } else {
      toast.warn(data3?.message || "Fetch Doctors with warning");
      console.warn(
        "Fetch Doctors Warning:",
        data3?.message || "Fetch Doctors with warning",
      );
    }

    return data3;
  } catch (error3) {
    toast.error(error3?.response?.data?.message || error3?.message);
    console.error("Fetch Doctors Error:", error3);

    throw error3;
  }
};

/* -------- Fetch Service Appointments Stats -------- */
export const fetchServiceAppointmentsStats = async () => {
  try {
    const response4 = await api.get(
      API_ROUTES.SERVICEAPPOINTMENTS.SERVICEAPPOINTMENTS_GET_STATS,
    );

    const data4 = response4.data;
    console.log("Fetch Service Appointments API Response:", data4);

    if (data4?.success) {
      // toast.success(data4?.message);
      console.log("Fetch Service Appointments Success:", data4?.message);
    } else {
      toast.warn(data4?.message || "Fetch service appointments with warning");
      console.warn(
        "Fetch Service Appointments Warning:",
        data4?.message || "Fetch Service Appointments with warning",
      );
    }

    return data4;
  } catch (error4) {
    toast.error(error4?.response?.data?.message || error4?.message);
    console.error("Fetch Service Appointments Error:", error4);

    throw error4;
  }
};

/* -------- Fetch Service By ID -------- */
export const fetchServiceByID = async (id) => {
  try {
    const response5 = await api.get(API_ROUTES.SERVICES.SERVICE_GET(id));

    const data5 = response5.data;
    console.log("Fetch Service API Response:", data5);

    if (data5?.success) {
      // toast.success(data5?.message);
      console.log("Fetch Service Success:", data5?.message);
    } else {
      toast.warn(data5?.message || "Fetch service with warning");
      console.warn(
        "Fetch Service Warning:",
        data5?.message || "Fetch Service with warning",
      );
    }

    return data5;
  } catch (error5) {
    toast.error(error5?.response?.data?.message || error5?.message);
    console.error("Fetch Service Error:", error5);

    throw error5;
  }
};

/* -------- Fetch Service -------- */
export const fetchServices = async () => {
  try {
    const response6 = await api.get(API_ROUTES.SERVICES.SERVICES_GET);

    const data6 = response6.data;
    console.log("Fetch Services API Response:", data6);

    if (data6?.success) {
      // toast.success(data6?.message);
      console.log("Fetch Services Success:", data6?.message);
    } else {
      toast.warn(data6?.message || "Fetch services with warning");
      console.warn(
        "Fetch Services Warning:",
        data6?.message || "Fetch Services with warning",
      );
    }

    return data6;
  } catch (error6) {
    toast.error(error6?.response?.data?.message || error6?.message);
    console.error("Fetch Services Error:", error6);

    throw error6;
  }
};

/* -------- Fetch Service Appointments -------- */
export const fetchServiceAppointments = async (params) => {
  try {
    const response7 = await api.get(
      API_ROUTES.SERVICEAPPOINTMENTS.SERVICEAPPOINTMENTS_GET,
      { params },
    );

    const data7 = response7.data;
    console.log("Fetch Service Appointments API Response:", data7);

    if (data7?.success) {
      // toast.success(data7?.message);
      console.log("Fetch Service Appointments Success:", data7?.message);
    } else {
      toast.warn(data7?.message || "Fetch service appointments with warning");
      console.warn(
        "Fetch Service Appointments Warning:",
        data7?.message || "Fetch Service Appointments with warning",
      );
    }

    return data7;
  } catch (error7) {
    toast.error(error7?.response?.data?.message || error7?.message);
    console.error("Fetch Service Appointments Error:", error7);

    throw error7;
  }
};
