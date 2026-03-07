// MediFlow / Client / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  DOCTORS: {
    DOCTORS_GET: `${BASE_URL}/api/doctors/doctors-get`,
    DOCTOR_GET: (id) => `${BASE_URL}/api/doctors/doctor-get/${id}`,
    DOCTOR_LOGIN: `${BASE_URL}/api/doctors/doctor-login`,
    DOCTOR_UPDATE: (id) => `${BASE_URL}/api/doctors/doctor-update/${id}`,
    DOCTOR_TOGGLE_AVAILABILITY: (id) =>
      `${BASE_URL}/api/doctors/${id}/doctor-toggle-availability/`,
  },
  SERVICES: {
    SERVICES_GET: `${BASE_URL}/api/services/services-get`,
    SERVICE_GET: (id) => `${BASE_URL}/api/services/service-get/${id}`,
  },
  APPOINTMENTS: {
    APPOINTMENT_CREATE: `${BASE_URL}/api/appointments/appointment-create`,
    APPOINTMENTS_GET_SLOTS_BYDOCTOR: (doctorId) =>
      `${BASE_URL}/api/appointments/appointments-get-slots-bydoctor/${doctorId}`,
    APPOINTMENTS_GET_BY_DOCTOR: (doctorId) =>
      `${BASE_URL}/api/appointments/appointments-get-by-doctor/${doctorId}`,
    APPOINTMENT_UPDATE: (id) =>
      `${BASE_URL}/api/appointments/appointment-update/${id}`,
    APPOINTMENT_GET_BY_PATIENT: `${BASE_URL}/api/appointments/appointment-get-by-patient`,
    APPOINTMENT_CONFIRM_PAYMENT: `${BASE_URL}/api/appointments/appointment-confirm-payment`,
  },
  SERVICEAPPOINTMENTS: {
    SERVICEAPPOINTMENTS_CREATE: `${BASE_URL}/api/serviceAppointments/serviceAppointment-create`,
    SERVICEAPPOINTMENTS_GET_SLOTS_BYSERVICE: (serviceId) =>
      `${BASE_URL}/api/serviceAppointments/serviceAppointment-get-slots-byService/${serviceId}`,
    SERVICEAPPOINTMENTS_GET_BY_PATIENT: `${BASE_URL}/api/serviceAppointments/serviceAppointment-get-by-patient`,
    SERVICEAPPOINTMENT_CONFIRM_PAYMENT: `${BASE_URL}/api/serviceAppointments/serviceAppointment-confirm-payment`,
  },
};

export default API_ROUTES;
