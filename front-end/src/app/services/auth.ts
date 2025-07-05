import { Injectable } from '@angular/core';
import { Token } from './token';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loggedIn: BehaviorSubject<boolean>;
  authStatus;

  constructor(private token: Token) {
    this.loggedIn = new BehaviorSubject<boolean>(this.token.loggedIn());
    this.authStatus = this.loggedIn.asObservable();
  }

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }
}
