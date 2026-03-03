// MediFlow / Client / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  DOCTORS: {
    DOCTORS_GET: `${BASE_URL}/api/doctors/doctors-get`,
    DOCTOR_GET: (id) => `${BASE_URL}/api/doctors/doctor-get/${id}`,
    DOCTOR_LOGIN: `${BASE_URL}/api/doctors/doctor-login`,
  },
  SERVICES: {
    SERVICES_GET: `${BASE_URL}/api/services/services-get`,
    SERVICE_GET: (id) => `${BASE_URL}/api/services/service-get/${id}`,
  },
  APPOINTMENTS: {
    APPOINTMENT_CREATE: `${BASE_URL}/api/appointments/appointment-create`,
    APPOINTMENTS_GET_SLOTS_BYDOCTOR: (doctorId) =>
      `${BASE_URL}/api/appointments/appointments-get-slots-bydoctor/${doctorId}`,
  },
  SERVICEAPPOINTMENTS: {
    SERVICEAPPOINTMENTS_CREATE: `${BASE_URL}/api/serviceAppointments/serviceAppointment-create`,
    SERVICEAPPOINTMENTS_GET_SLOTS_BYSERVICE: (serviceId) =>
      `${BASE_URL}/api/serviceAppointments/serviceAppointment-get-slots-byService/${serviceId}`,
  },
};

export default API_ROUTES;
