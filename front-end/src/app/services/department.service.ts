import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";
import {
  CreateDepartmentResponse, DeleteDepartmentResponse,
  Department,
  DepartmentFilter,
  GetAllDepartmentResponse, UpdateDepartmentResponse
} from "@store/department/department.model";

@Injectable({
  providedIn: 'root'
})
  export class DepartmentService {
  lastFilter:DepartmentFilter;

  constructor(private http:HttpClient,
              private helperService:HelperService) { }

  getAllDepartment(filter: DepartmentFilter): Observable<GetAllDepartmentResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllDepartmentResponse>('/departments',{params: this.helperService.convertToHttpParams(filter) });
  }

  createDepartment(department: Department): Observable<CreateDepartmentResponse> {
    return this.http.post<CreateDepartmentResponse>('/departments', department);
  }

  updateDepartment(departmentId: number,department: Department): Observable<UpdateDepartmentResponse> {
    return this.http.put<UpdateDepartmentResponse>('/departments/'+ departmentId, department);
  }

  deleteDepartment(departmentId: number): Observable<DeleteDepartmentResponse> {
    return this.http.delete<DeleteDepartmentResponse>('/departments/'+ departmentId);
  }
}
