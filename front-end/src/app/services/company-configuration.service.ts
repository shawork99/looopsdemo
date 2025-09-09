import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Company,
  CompanyInfoResponse,
  UpdateCompanyResponse
} from "@store/company_configuration/company_configuration.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyConfigurationService {
  lastCompany: Company | null = null;

  private readonly API_URL = '/company_configuration';
  private readonly CURRENCIES_URL = '/currencies';

  constructor(private http: HttpClient) {}

  getCompanyInfo(): Observable<CompanyInfoResponse> {
    return this.http.get<CompanyInfoResponse>(this.API_URL);
  }

  getCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(this.CURRENCIES_URL);
  }
  
  updateCompanyInfo(id: number, data: Company): Observable<UpdateCompanyResponse> {
      return this.http.put<UpdateCompanyResponse>(`/company_configuration/${id}`, data);
    }

}
