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

/* -------- Fetch Service By ID -------- */
export const fetchServiceByID = async (id) => {
  try {
    if (!id) throw new Error("Service ID is required.");

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

/* -------- Fetch Service Booked Slots -------- */
export const fetchServiceBookedSlots = async (serviceId, dateISO) => {
  try {
    if (!serviceId || !dateISO) return null;

    const response6 = await api.get(
      API_ROUTES.SERVICEAPPOINTMENTS.SERVICEAPPOINTMENTS_GET_SLOTS_BYSERVICE(
        serviceId,
      ),
      { params: { date: dateISO } },
    );

    const data6 = response6.data;
    console.log("Fetch Booked Slots API Response:", data6);

    if (data6?.success) {
      // toast.success(data6?.message);
      console.log("Fetch Service Booked Slots Success:", data6?.message);
    } else {
      toast.warn(data6?.message || "Fetch service booked slots with warning");
      console.warn(
        "Fetch Service Booked Slots Warning:",
        data6?.message || "Fetch Service Booked Slots with warning",
      );
    }

    return data6;
  } catch (error6) {
    toast.error(error6?.response?.data?.message || error6?.message);
    console.error("Fetch Service Booked Slots Error:", error6);

    throw error6;
  }
};

/* -------- Fetch Appointments By Doctor -------- */
export const fetchAppointmentsByDoctor = async (doctorId) => {
  try {
    const response7 = await api.get(
      API_ROUTES.APPOINTMENTS.APPOINTMENTS_GET_BY_DOCTOR(doctorId),
    );

    const data7 = response7.data;
    console.log("Fetch Appointments By Doctor API Response:", data7);

    if (data7?.success) {
      // toast.success(data7?.message);
      console.log("Fetch Appointments By Doctor Success:", data7?.message);
    } else {
      toast.warn(data7?.message || "Fetch appointments by doctor with warning");
      console.warn(
        "Fetch Appointments By Doctor Warning:",
        data7?.message || "Fetch Appointments By Doctor with warning",
      );
    }

    return data7;
  } catch (error7) {
    toast.error(error7?.response?.data?.message || error7?.message);
    console.error("Fetch Appointments By Doctor Error:", error7);

    throw error7;
  }
};

/* -------- Fetch Appointments By Patient -------- */
export const fetchAppointmentsByPatient = async (token) => {
  try {
    const response8 = await api.get(
      API_ROUTES.APPOINTMENTS.APPOINTMENT_GET_BY_PATIENT,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    const data8 = response8.data;
    console.log("Fetch Appointments By Patient API Response:", data8);

    if (data8?.success) {
      // toast.success(data8?.message);
      console.log("Fetch Appointments By Patient Success:", data8?.message);
    } else {
      toast.warn(
        data8?.message || "Fetch appointments by patient with warning",
      );
      console.warn(
        "Fetch Appointments By Patient Warning:",
        data8?.message || "Fetch Appointments By Patient with warning",
      );
    }

    return data8;
  } catch (error8) {
    toast.error(error8?.response?.data?.message || error8?.message);
    console.error("Fetch Appointments By Patient Error:", error8);

    throw error8;
  }
};

/* -------- Fetch Service Appointments By Patient -------- */
export const fetchServiceAppointmentsByPatient = async (token) => {
  try {
    const response9 = await api.get(
      API_ROUTES.SERVICEAPPOINTMENTS.SERVICEAPPOINTMENTS_GET_BY_PATIENT,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    const data9 = response9.data;
    console.log("Fetch Service Appointments By Patient API Response:", data9);

    if (data9?.success) {
      // toast.success(data9?.message);
      console.log(
        "Fetch Service Appointments By Patient Success:",
        data9?.message,
      );
    } else {
      toast.warn(
        data9?.message || "Fetch service appointments by patient with warning",
      );
      console.warn(
        "Fetch Service Appointments By Patient Warning:",
        data9?.message || "Fetch Service Appointments By Patient with warning",
      );
    }

    return data9;
  } catch (error9) {
    toast.error(error9?.response?.data?.message || error9?.message);
    console.error("Fetch Service Appointments By Patient Error:", error9);

    throw error9;
  }
};

/* -------- Verify Payment -------- */
export const verifyPayment = async (sessionId) => {
  try {
    const response10 = await api.get(
      API_ROUTES.APPOINTMENTS.APPOINTMENT_CONFIRM_PAYMENT,
      {
        params: { session_id: sessionId },
      },
    );

    const data10 = response10.data;
    console.log("Verify Payment API Response:", data10);

    if (data10?.success) {
      toast.success(data10?.message);
      console.log("Verify Payment Success:", data10?.message);
    } else {
      toast.warn(data10?.message || "Verify payment with warning");
      console.warn(
        "Verify Payment Warning:",
        data10?.message || "Verify Payment with warning",
      );
    }

    return data10;
  } catch (error10) {
    toast.error(error10?.response?.data?.message || error10?.message);
    console.error("Verify Payment Error:", error10);

    throw error10;
  }
};

/* -------- Verify Service Payment -------- */
export const verifyServicePayment = async (sessionId) => {
  try {
    const response11 = await api.get(
      API_ROUTES.SERVICEAPPOINTMENTS.SERVICEAPPOINTMENT_CONFIRM_PAYMENT,
      {
        params: { session_id: sessionId },
      },
    );

    const data11 = response11.data;
    console.log("Verify Service Payment API Response:", data11);

    if (data11?.success) {
      toast.success(data11?.message);
      console.log("Verify Service Payment Success:", data11?.message);
    } else {
      toast.warn(data11?.message || "Verify service payment with warning");
      console.warn(
        "Verify Service Payment Warning:",
        data11?.message || "Verify Service Payment with warning",
      );
    }

    return data11;
  } catch (error11) {
    toast.error(error11?.response?.data?.message || error11?.message);
    console.error("Verify Service Payment Error:", error11);

    throw error11;
  }
};
