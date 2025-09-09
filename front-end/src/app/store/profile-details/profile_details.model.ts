
export interface profile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  calling_name?: string | null;
  employee_code?: string;
  contact_no?: string;
  address?: string;
  country?: string;
  department?: string;
  designation?: string;
  profile_image?: string;
  shift?: string;        
  date_of_joined?: string;
  date_of_birth ?:string;
  contact_number_office?:string;
  leave_type?:string,
  department_code?:string;
  designation_code?:string;
  reoprting_manger?:string;
  gender :number;
  company_logo?: string; 
}


export interface ProfiledetailsInfoResponse {
  success: boolean;
  data: profile;
  message: string;
}

export interface UpdateProfiledetails {
  success: boolean;
  message: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

