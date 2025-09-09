import { Injectable } from '@angular/core';
import {
  CreateRoleResponse,
  DeleteRoleResponse,
  GetAllRolesResponse,
  Role,
  RoleFilter,
  UpdateRoleResponse
} from "@store/role/role.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "@/app/services/helper.service";

@Injectable({
  providedIn: 'root'
})
  export class RoleService {
  lastFilter:RoleFilter;

  constructor(private http:HttpClient,
              private helperService:HelperService) { }

  getAllRoles(filter: RoleFilter): Observable<GetAllRolesResponse> {
    this.lastFilter = filter;
    return this.http.get<GetAllRolesResponse>('/roles',{params: this.helperService.convertToHttpParams(filter) });
  }

  createRole(role: Role): Observable<CreateRoleResponse> {
    return this.http.post<CreateRoleResponse>('/roles', role);
  }

  updateRole(roleId: number,role: Role): Observable<UpdateRoleResponse> {
    return this.http.put<UpdateRoleResponse>('/roles/'+ roleId, role);
  }

  deleteRole(roleId: number): Observable<DeleteRoleResponse> {
    return this.http.delete<DeleteRoleResponse>('/roles/'+ roleId);
  }
}
