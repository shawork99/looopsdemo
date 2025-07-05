import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { Observable} from 'rxjs';
import {Token} from './token';


@Injectable({
  providedIn: 'root'
})
export class AfterLogin implements  CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean | Observable<boolean> {
    return this.token.loggedIn();

  }

  constructor(private token:Token) { }
}

