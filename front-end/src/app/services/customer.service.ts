import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "@/app/services/helper.service";
import {
  Customer,
  CustomerFilter,
  CreateCustomerResponse,
  GetAllCustomerResponse,
  UpdateCustomerResponse,
  DeleteCustomerResponse
} from "@store/customer/customer.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  lastFilter: CustomerFilter;

  constructor(private http: HttpClient,
              private helperService: HelperService) {}

  getAllCustomers(filter: CustomerFilter): Observable<GetAllCustomerResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllCustomerResponse>(
      '/customers',
      { params: this.helperService.convertToHttpParams(filter) }
    );
  }

  createCustomer(data: Customer): Observable<CreateCustomerResponse> {
    return this.http.post<CreateCustomerResponse>('/customers', data);
  }

  updateCustomer(id: number, data: Customer): Observable<UpdateCustomerResponse> {
    return this.http.put<UpdateCustomerResponse>(`/customers/${id}`, data);
  }

  deleteCustomer(id: number): Observable<DeleteCustomerResponse> {
    return this.http.delete<DeleteCustomerResponse>(`/customers/${id}`);
  }
}
