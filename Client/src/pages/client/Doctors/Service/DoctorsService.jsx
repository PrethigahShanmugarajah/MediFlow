import { fetchDoctors } from "../../../../services/fetch";
import { normalizeDoctor } from "../../../../utils/client/clientHelpers";

export async function fetchDoctorsApi(setAllDoctors, setError, setLoading) {
  setLoading(true);
  setError("");

  try {
    const json = await fetchDoctors();

    if (!json?.success) {
      setError(
        json?.message ||
          "Unable to load the list of doctors at this time. Please try again later.",
      );
      setAllDoctors([]);
      return false;
    }

    const items = Array.isArray(json?.data) ? json.data : [];
    const normalized = items.map(normalizeDoctor);
    setAllDoctors(normalized);
    return true;
  } catch {
    setError(
      "A network error occurred while retrieving the list of doctors. Please try again later.",
    );
    setAllDoctors([]);
    return false;
  } finally {
    setLoading(false);
  }
}
