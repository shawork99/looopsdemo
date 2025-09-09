import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {Store} from "@ngrx/store";
import {selectAuthToken, selectUserPermission} from "../../features/auth/store/auth.selectors";
import {take} from "rxjs";
import {map} from "rxjs/operators";
import {Permission} from "../../shared/models/navigation.model";

export const permissionGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
    const router = inject(Router);
    const requiredPermission = route.data['permission'];
    if(!requiredPermission){
        router.navigate(['notfound']);
        return false;
    }
  return store.select(selectUserPermission).pipe(
      take(1),
      map((permissions:string)=>{
          if(permissions?.includes(requiredPermission)){
              return true;
          } else {
              router.navigate(['notfound']);
              return false;
          }
      })
  );
};
