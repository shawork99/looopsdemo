import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable} from 'rxjs';
import {Token} from './token';

@Injectable({
  providedIn: 'root'
})
export class BeforeLogin  implements  CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean | Observable<boolean> {
    return !this.token.loggedIn();

  }

  constructor(private token:Token) { }
}
