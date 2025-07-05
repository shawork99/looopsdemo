import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class Backend {

  constructor(private Http:HttpClient) { }
  signup(data:any){
    return this.Http.post('http://127.0.0.1:8000/api/signup',data);

  }

  login(data:any){
    return this.Http.post('http://127.0.0.1:8000/api/login',data);

  }
}
