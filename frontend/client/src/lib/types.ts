export interface PropertyImage {
  url: string;
  publicId: string;
  _id?: string;
}

export interface PropertyAddress {
  street?: string;
  number?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
}

export type PropertyType =
  | "casa"
  | "apartamento"
  | "terreno"
  | "comercial"
  | "chacara"
  | "sobrado";

export type PropertyPurpose = "venda" | "aluguel";

export type PropertyStatus =
  | "disponivel"
  | "vendido"
  | "alugado"
  | "indisponivel";

export interface Property {
  _id: string;
  title: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  area: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpaces: number;
  condominiumFee: number;
  iptu: number;
  address: PropertyAddress;
  features: string[];
  images: PropertyImage[];
  status: PropertyStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  search?: string;
  tipo?: string;
  finalidade?: string;
  cidade?: string;
  quartos?: number;
  minPreco?: number;
  maxPreco?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
}