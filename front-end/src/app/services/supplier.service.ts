import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "@/app/services/helper.service";
import {
  Supplier,
  SupplierFilter,
  CreateSupplierResponse,
  GetAllSupplierResponse,
  UpdateSupplierResponse,
  DeleteSupplierResponse
} from "@store/suppliers/supplier.model";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  lastFilter: SupplierFilter;

  constructor(private http: HttpClient, private helperService: HelperService) {}

  getAllSuppliers(filter: SupplierFilter): Observable<GetAllSupplierResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllSupplierResponse>(
      '/suppliers',
      { params: this.helperService.convertToHttpParams(filter) }
    );
  }

  createSupplier(data: Supplier): Observable<CreateSupplierResponse> {
    return this.http.post<CreateSupplierResponse>('/suppliers', data);
  }

  updateSupplier(id: number, data: Supplier): Observable<UpdateSupplierResponse> {
    return this.http.put< UpdateSupplierResponse>(`/suppliers/${id}`, data);
  }

  deleteSupplier(id: number): Observable<DeleteSupplierResponse> {
    return this.http.delete<DeleteSupplierResponse>(`/suppliers/${id}`);
  }
}
