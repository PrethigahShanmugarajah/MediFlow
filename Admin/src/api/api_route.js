const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  APPOINTMENTS: {
    APPOINTMENTS_GET_REGISTERED_USERCOUNT: `${BASE_URL}/api/appointments/appointment-get-registered-usercount`,
    APPOINTMENTS_GET: `${BASE_URL}/api/appointments/appointments-get`,
    APPOINTMENT_CANCEL: (id) =>
      `${BASE_URL}/api/appointments/${id}/appointment-cancel`,
  },
  DOCTORS: {
    DOCTORS_GET: `${BASE_URL}/api/doctors/doctors-get`,
    DOCTOR_CREATE: `${BASE_URL}/api/doctors/doctor-create`,
    DOCTOR_DELETE: (id) => `${BASE_URL}/api/doctors/doctor-delete/${id}`,
  },
  SERVICEAPPOINTMENTS: {
    SERVICEAPPOINTMENTS_GET_STATS: `${BASE_URL}/api/serviceAppointments/serviceAppointment-get-stats/summary`,
    SERVICEAPPOINTMENTS_GET: `${BASE_URL}/api/serviceAppointments/serviceAppointments-get`,
    SERVICEAPPOINTMENT_UPDATE: (id) =>
      `${BASE_URL}/api/serviceAppointments/serviceAppointment-update/${id}`,
    SERVICEAPPOINTMENT_CANCEL: (id) =>
      `${BASE_URL}/api/serviceAppointments/${id}/serviceAppointment-cancel`,
  },
  SERVICES: {
    SERVICE_GET: (id) => `${BASE_URL}/api/services/service-get/${id}`,
    SERVICE_UPDATE: (id) => `${BASE_URL}/api/services/service-update/${id}`,
    SERVICE_CREATE: `${BASE_URL}/api/services/service-create`,
    SERVICES_GET: `${BASE_URL}/api/services/services-get`,
    SERVICE_DELETE: (id) => `${BASE_URL}/api/services/service-delete/${id}`,
  },
};

export default API_ROUTES;
