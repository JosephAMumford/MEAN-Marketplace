import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthorizationService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, status: RouterStateSnapshot): boolean {
    const isAuthed = this.auth.isAuthed();

    if(!isAuthed){
      this.router.navigate(['/']);
    }

    return isAuthed;
  }
}

