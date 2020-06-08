import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router
  ){ }
  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      if(localStorage.getItem("logado") != null) this.router.navigate(['menu']);
      resolve(localStorage.getItem("logado") == null ? true : false);
    });
  }
  
}
