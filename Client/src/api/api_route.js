// MediFlow / Client / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  DOCTORS: {
    DOCTORS_GET: `${BASE_URL}/api/doctors/doctors-get`,
    DOCTOR_GET: (id) => `${BASE_URL}/api/doctors/doctor-get/${id}`,
  },
  SERVICES: {
    SERVICES_GET: `${BASE_URL}/api/services/services-get`,
  },
  APPOINTMENTS: {
    APPOINTMENT_CREATE: `${BASE_URL}/api/appointments/appointment-create`,
  },
};

export default API_ROUTES;
