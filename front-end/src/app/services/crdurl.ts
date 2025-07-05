import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Crdpost } from '../services/crdpost';

@Injectable({
  providedIn: 'root'
})
export class Crdurl {
  private apiurl = "http://127.0.0.1:8000/api/posts";

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Crdpost[]> {

    return this.http.get<Crdpost[]>(this.apiurl);

  }

  creatPost(data: Crdpost): Observable<Crdpost> {
    return this.http.post<Crdpost>(this.apiurl, data);
  }

  findPost(id: string): Observable<Crdpost> {
   return this.http.get<Crdpost>(`${this.apiurl}/${+id}`);
  }

  updatePost(id: string, data: Crdpost): Observable<Crdpost> {
   return this.http.put<Crdpost>(`${this.apiurl}/${+id}`,data);
  }

   deletePost(id: any): Observable<any> {
   return this.http.delete<any>(`${this.apiurl}/${+id}`);
  }


}
