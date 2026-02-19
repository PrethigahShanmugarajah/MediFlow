// MediFlow / Admin / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  DOCTORS: {
    DOCTORS_GET: `${BASE_URL}/api/doctors/doctors-get`,
    DOCTORS_CREATE: `${BASE_URL}/api/doctors/doctor-create`,
    DOCTOR_DELETE: (id) => `${BASE_URL}/api/doctors/doctor-delete/${id}`,
  },
  APPOINTMENT: {
    APPOINTMENT_GET_REGISTERED_USERCOUNT: `${BASE_URL}/api/appointments/appointment-get-registered-usercount`,
    APPOINTMENT_GET: `${BASE_URL}/api/appointments/appointments-get`,
    APPOINTMENT_CANCEL: (id) =>
      `${BASE_URL}/api/appointments/${id}/appointment-cancel`,
  },
  SERVICE: {
    SERVICES_GET: `${BASE_URL}/api/services/services-get`,
    SERVICE_GET: (id) => `${BASE_URL}/api/services/service-get/${id}`,
    SERVICE_CREATE: `${BASE_URL}/api/services/service-create`,
    SERVICE_UPDATE: (id) => `${BASE_URL}/api/services/service-update/${id}`,
    SERVICE_DELETE: (id) => `${BASE_URL}/api/services/service-delete/${id}`,
  },
  SERVICEAPPOINTMENT: {
    SERVICEAPPOINTMENT_GET_STATS: `${BASE_URL}/api/serviceAppointments/serviceAppointment-get-stats/summary`,
    SERVICEAPPOINTMENTS_GET: `${BASE_URL}/api/serviceAppointments/serviceAppointments-get`,
    SERVICEAPPOINTMENTS_UPDATE: (id) =>
      `${BASE_URL}/api/serviceAppointments/serviceAppointment-update/${id}`,
    SERVICEAPPOINTMENTS_CANCEL: (id) =>
      `${BASE_URL}/api/serviceAppointments/${id}/serviceAppointment-cancel`,
  },
};

export default API_ROUTES;
