import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class IfauthGuard implements CanActivate {
  constructor(private router: Router, private commonServices: CommonService) { }

  canActivate() {
    if (!localStorage.getItem('Access_Token')) {
      return true;
    }
    this.router.navigate([`/p/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/m`]);
    // this.commonServices.error('Please click Logout for redirection to Login Page', '');
    return false;
  }

}
