// supplier.model.ts

export interface Supplier {
  id: number;
  supplier_code: string;
  person_name: string;
  company_name: string;
  email: string;
  contact_number: string;
  address: string;
  business_register_number: string;
  status: number;
  company_id?: number;
  created_by?: number;
  updated_by?: number;
  deleted_by?: number;
}

export interface SupplierFilter {
  search: string;
  perPage: number;
  page: number;
}

export interface SupplierPaginate {
  current_page: number;
  data: Supplier[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface GetAllSupplierResponse {
  success: boolean;
  message: string;
  data: SupplierPaginate;
}

export interface CreateSupplierResponse {
  success: boolean;
  message: string;
}

export interface UpdateSupplierResponse {
  success: boolean;
  message: string;
}

export interface DeleteSupplierResponse {
  success: boolean;
  message: string;
}
