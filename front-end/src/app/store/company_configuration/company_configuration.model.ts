
export interface Company {
  id: number;
  name: string;
  company_code: string;
  country: string;
  currency: string;
  time_zone: string;
  contact_person: string;
  contact_email: string;
  contact_no: string;
  company_start_date: string;
  memo: string;
  is_active: boolean;
  company_logo: string;
}

export interface CompanyInfoResponse {
  success: boolean;
  data: Company;
  message: string;
}

export interface UpdateCompanyResponse {
  success: boolean;
  message: string;
}
