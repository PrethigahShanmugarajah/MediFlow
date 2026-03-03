// MediFlow / Client / src / pages / Doctors / Service / DoctorsService.jsx
import { fetchDoctors } from "../../../../services/fetch";
import { normalizeDoctorsResponse } from "../../../../utils/client/doctorsUtils";

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

    const normalized = normalizeDoctorsResponse(json);
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
