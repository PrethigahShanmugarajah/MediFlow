import { fetchServiceAppointmentsStats } from "../../../services/fetch";
import { buildNormalizedServicesFromResponse } from "../../../utils/serviceDashboardUtils";

export async function getServiceDashboardServices() {
  const body = await fetchServiceAppointmentsStats();
  return buildNormalizedServicesFromResponse(body);
}
