import { fetchServices } from "../../../../services/fetch";
import { normalizeService } from "../../../../utils/client/clientHelpers";

export async function fetchServicesApi(setServices, setError, setLoading) {
  setLoading(true);
  setError("");

  try {
    const json = await fetchServices();

    if (!json?.success) {
      setError(
        json?.message ||
          "Unable to load the list of services at this time. Please try again later.",
      );
      setServices([]);
      return false;
    }

    const items = Array.isArray(json?.data) ? json.data : [];
    const normalized = items.map(normalizeService);
    setServices(normalized);
    return true;
  } catch {
    setError(
      "A network error occurred while retrieving the list of services. Please try again later.",
    );
    setServices([]);
    return false;
  } finally {
    setLoading(false);
  }
}
