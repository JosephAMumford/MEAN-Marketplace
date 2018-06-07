import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../authorization.service';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService, private router: Router) { }
  user = new User();

  registrationErrors: string[] = [];

  ngOnInit() {
  }

  login_user(luser: User) {
    console.log(luser);
    this.authorizationService.login(luser).subscribe( ()=> {
      this.router.navigateByUrl('home');
    })
  }
}
