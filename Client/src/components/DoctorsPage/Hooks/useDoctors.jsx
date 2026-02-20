// MediFlow / Client / src / components / DoctorsPage / Hooks / useDoctors.jsx
import { useCallback, useEffect, useState } from "react";
import { fetchDoctors } from "../../../services/fetch";
import { normalizeDoctors } from "../Utils/normalizeDoctors";

export function useDoctors() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchDoctors();
      const list = res?.data || res?.doctors || res?.items || res?.result || [];
      setAllDoctors(normalizeDoctors(list));
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Network error while loading doctors.";
      setError(msg);
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { allDoctors, loading, error, retry: load };
}
