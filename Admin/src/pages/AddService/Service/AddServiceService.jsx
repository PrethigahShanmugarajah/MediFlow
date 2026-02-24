// MediFlow / Admin / src / pages / AddService / Service / AddServiceService.jsx
import { fetchServiceByID } from "../../../services/fetch";
import { createService, updateService } from "../../../services/mutations";
import {
  buildServiceFormData,
  getServiceFormStateFromApi,
} from "../../../utils/addServiceUtils";

export async function getServiceByIDApi(serviceId) {
  const payload = await fetchServiceByID(serviceId);
  const data = payload?.data || payload;
  return getServiceFormStateFromApi(data);
}

export async function createServiceApi(values) {
  const fd = buildServiceFormData(values);
  return await createService(fd);
}

export async function updateServiceApi(serviceId, values) {
  const fd = buildServiceFormData(values);
  return await updateService(serviceId, fd);
}
