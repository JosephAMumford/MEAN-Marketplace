import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../authorization.service';

import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService, private router: Router) { }
  user = new User();

  ngOnInit() {
  }

  register_user(){
    console.log("component registering user");
    this.authorizationService.register(this.user).subscribe(user => {
      this.router.navigateByUrl('');
      this.user = new User();
    });
  }
}
