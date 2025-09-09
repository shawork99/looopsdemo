export interface Customer {
    id: number;
    customer_code: string;
    person_name: string;
    company_name: string;
    email: string;
    contact_number: string;
    address: string;
    business_registration_no: string;
    status: 'active' | 'inactive';
    company_id?: number;
    created_by?: number;
    updated_by?: number;
    deleted_by?: number;
  }
  
  export interface CustomerFilter {
    search: string;
    perPage: number;
    page: number;
  }
  
  export interface CustomerPaginate {
    current_page: number;
    data: Customer[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  }
  
  export interface GetAllCustomerResponse {
    success: boolean;
    message: string;
    data: CustomerPaginate;
  }
  
  export interface CreateCustomerResponse {
    success: boolean;
    message: string;
  }
  
  export interface UpdateCustomerResponse {
    success: boolean;
    message: string;
  }
  
  export interface DeleteCustomerResponse {
    success: boolean;
    message: string;
  }
  