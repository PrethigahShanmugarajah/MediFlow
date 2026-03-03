// MediFlow / Client / src / pages / Home / Service / HomeService.jsx
import { fetchDoctors, fetchServices } from "../../../../services/fetch";
import {
  normalizeHomeDoctorsResponse,
  normalizeHomeServicesResponse,
} from "../../../../utils/client/homeUtils";

/* -------- HomeDoctors -------- */
export async function fetchDoctorsApi(setDoctors, setError, setLoading) {
  setLoading?.(true);
  setError?.("");

  try {
    const json = await fetchDoctors();

    if (json?.success) {
      const normalized = normalizeHomeDoctorsResponse(json);
      setDoctors?.(normalized);
      return true;
    }

    setDoctors?.([]);
    return false;
  } catch (error) {
    setError?.(
      "A network error occurred while loading the doctors. Please try again.",
    );
    setDoctors?.([]);
    return false;
  } finally {
    setLoading?.(false);
  }
}

/* -------- HomeServices -------- */
export async function fetchHomeServicesApi(setServices, setError, setLoading) {
  setLoading?.(true);
  setError?.("");

  try {
    const json = await fetchServices();

    if (json?.success) {
      const normalized = normalizeHomeServicesResponse(json);
      setServices?.(normalized);
      return true;
    }

    setServices?.([]);
    return false;
  } catch (error) {
    setError?.(
      "A network error occurred while loading services. Please try again.",
    );
    setServices?.([]);
    return false;
  } finally {
    setLoading?.(false);
  }
}
