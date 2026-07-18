import { api } from "./api";
import type {
  AdminResource,
  AdminResourceList,
  AdminResourceSort,
} from "../types/admin-resource";

export type AdminResourcePath = "brands" | "categories";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function getAdminResources(
  resource: AdminResourcePath,
  params: { page: number; limit: number; search: string; sort: AdminResourceSort },
) {
  const response = await api.get<ApiResponse<AdminResourceList>>(`/admin/${resource}`, {
    params,
  });
  return response.data.data;
}

export async function createAdminResource(resource: AdminResourcePath, name: string) {
  const response = await api.post<ApiResponse<AdminResource>>(`/admin/${resource}`, { name });
  return response.data;
}

export async function updateAdminResource(
  resource: AdminResourcePath,
  id: string,
  name: string,
) {
  const response = await api.patch<ApiResponse<AdminResource>>(
    `/admin/${resource}/${id}`,
    { name },
  );
  return response.data;
}

export async function deleteAdminResource(resource: AdminResourcePath, id: string) {
  const response = await api.delete<{ success: boolean; message?: string }>(
    `/admin/${resource}/${id}`,
  );
  return response.data;
}
