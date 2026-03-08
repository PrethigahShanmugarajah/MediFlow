import { fetchServiceByID } from "../../../services/fetch";
import { createService, updateService } from "../../../services/mutations";
import {
  buildAddServiceFormData,
  getServiceFormStateFromApi,
} from "../../../utils/addServiceUtils";

export async function getServiceByIDApi(serviceId) {
  const payload = await fetchServiceByID(serviceId);
  const data = payload?.data || payload;
  return getServiceFormStateFromApi(data);
}

export async function createServiceApi(values) {
  const fd = buildAddServiceFormData(values);
  return await createService(fd);
}

export async function updateServiceApi(serviceId, values) {
  const fd = buildAddServiceFormData(values);
  return await updateService(serviceId, fd);
}
