export interface Location {
    id: number;
    location_code: string;
    location_name: string;
    latitude: string;
    longitude: string;
    radius: string;
    is_active: boolean;
    company_id?: number;
    created_by?: number;
    updated_by?: number;
    deleted_by?: number;
  }
  
  export interface LocationFilter {
    search: string;
    perPage: number;
    page: number;
  }
  
  export interface LocationPaginate {
    current_page: number;
    data: Location[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  }
  
  export interface GetAllLocationResponse {
    success: boolean;
    message: string;
    data: LocationPaginate;
  }
  
  export interface CreateLocationResponse {
    success: boolean;
    message: string;
  }
  
  export interface UpdateLocationResponse {
    success: boolean;
    message: string;
  }
  
  export interface DeleteLocationResponse {
    success: boolean;
    message: string;
  }
  