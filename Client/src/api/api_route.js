// MediFlow / Client / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  DOCTORS: {
    DOCTORS_GET: `${BASE_URL}/api/doctors/doctors-get`,
  },
  SERVICES: {
    SERVICES_GET: `${BASE_URL}/api/services/services-get`,
  },
};

export default API_ROUTES;
