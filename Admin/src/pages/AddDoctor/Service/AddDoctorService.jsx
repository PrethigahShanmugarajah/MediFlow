import { createDoctor } from "../../../services/mutations";
import { makeDoctorPreviewFromResponse } from "../../../utils/addDoctorUtils";

export async function addDoctor(formData, formForFallback) {
  const data = await createDoctor(formData);

  if (data?.token) {
    try {
      localStorage.setItem("token", data.token);
    } catch {}
  }

  const doctor = makeDoctorPreviewFromResponse(data, formForFallback);

  return { data, doctor };
}
