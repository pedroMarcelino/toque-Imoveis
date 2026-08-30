import { api } from "./api";
import type {
  Property,
  PropertyFilters,
  PropertyListResponse,
  PropertyImage,
} from "./types";

function toQuery(obj: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const str = params.toString();
  return str ? `?${str}` : "";
}

export function getProperties(filters: PropertyFilters = {}) {
  return api.get<PropertyListResponse>(`/property${toQuery(filters)}`);
}

export function getProperty(id: string) {
  return api.get<Property>(`/property/${id}`);
}

export function createProperty(data: Partial<Property>) {
  return api.post<Property>("/property", data);
}

export function updateProperty(id: string, data: Partial<Property>) {
  return api.patch<Property>(`/property/${id}`, data);
}

export function deleteProperty(id: string) {
  return api.delete<Property>(`/property/${id}`);
}

export function uploadPropertyImages(id: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return api.uploadFormData<{ message: string; images: PropertyImage[] }>(
    `/property/${id}/images`,
    formData,
  );
}