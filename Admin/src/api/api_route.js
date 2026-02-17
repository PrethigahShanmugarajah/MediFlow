// MediFlow / Admin / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  DOCTORS: {
    DOCTORS_GET: `${BASE_URL}/api/doctors/doctors-get`,
    DOCTORS_CREATE: `${BASE_URL}/api/doctors/doctor-create`,
  },
  APPOINTMENT: {
    APPOINTMENT_GET_REGISTERED_USERCOUNT: `${BASE_URL}/api/appointments/appointment-get-registered-usercount`,
  },
};

export default API_ROUTES;
