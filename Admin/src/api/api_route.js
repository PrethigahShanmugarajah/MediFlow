// MediFlow / Admin / src / api / api_route.js
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
};

export default API_ROUTES;
