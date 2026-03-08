import { fetchDoctors, fetchServices } from "../../../../services/fetch";
import {
  normalizeDoctor,
  normalizeService,
} from "../../../../utils/client/clientHelpers";

export async function fetchDoctorsApi(setDoctors, setError, setLoading) {
  setLoading?.(true);
  setError?.("");

  try {
    const json = await fetchDoctors();

    if (json?.success) {
      const items = Array.isArray(json?.data) ? json.data : [];
      const normalized = items.map(normalizeDoctor);
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

export async function fetchHomeServicesApi(setServices, setError, setLoading) {
  setLoading?.(true);
  setError?.("");

  try {
    const json = await fetchServices();

    if (json?.success) {
      const items = Array.isArray(json?.data) ? json.data : [];
      const normalized = items.map(normalizeService);
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
