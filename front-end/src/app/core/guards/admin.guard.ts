import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {Store} from "@ngrx/store";
import {take} from "rxjs";
import {map} from "rxjs/operators";
import {getIsLoggedIn} from "@store/authentication/authentication.selector";

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(getIsLoggedIn).pipe(
      take(1),
      map((isLogin:boolean)=>{
        if (isLogin) {
          return true;
        } else {
          router.navigate(['auth/login']);
          return false;
        }
      })
  );
};
