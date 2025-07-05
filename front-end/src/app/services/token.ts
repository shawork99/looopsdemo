import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Token {

  constructor() { }

  handle(token: any, user: any) {
    this.set(token);
    this.setUser(user);
  }

  set(token: any) {
    return localStorage.setItem('token', token);
  }

  get() {
    return localStorage.getItem('token');
  }

  remove() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isvalid() {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return (payload.iss === "http://127.0.0.1:8000/api/login") ? true : false;
      }
    }
    return false;
  }

  payload(token: any) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload: any) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isvalid();
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
