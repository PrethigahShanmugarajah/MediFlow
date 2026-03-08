import {
  fetchDoctors,
  fetchRegisteredUserCount,
} from "../../../services/fetch";
import { normalizeDoctor } from "../../../utils/dashboardUtils";

export const getRegisteredUserCount = async () => {
  const data = await fetchRegisteredUserCount();

  const count = Number(data?.count ?? data?.totalUsers ?? data?.data ?? 0);

  return Number.isNaN(count) ? 0 : count;
};

export const getDoctorsForDashboard = async (params = { limit: 200 }) => {
  const data = await fetchDoctors(params);

  let list = [];

  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data?.doctors)) list = data.doctors;
  else if (Array.isArray(data?.data)) list = data.data;
  else if (Array.isArray(data?.items)) list = data.items;
  else {
    const firstArray = Object.values(data || {}).find((v) => Array.isArray(v));
    if (firstArray) list = firstArray;
  }

  return list.map((d) => normalizeDoctor(d));
};
