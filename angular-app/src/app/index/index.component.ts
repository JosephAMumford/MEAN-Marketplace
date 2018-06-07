import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../authorization.service';

import { User } from '../user';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  user = new User();
  loginInfo = new User();
  all_users: Array<User> = [];

  registrationErrors: string[] = [];


  constructor(private authorizationService: AuthorizationService, private router: Router) { }

  ngOnInit() {
    this.authorizationService.get_users().subscribe(users => {
      this.all_users = users;
      this.router.navigateByUrl('');
    });
  }

  register_user(){
    console.log("component registering user");
    this.authorizationService.register(this.loginInfo).subscribe(user => {
      this.router.navigateByUrl('');
      this.refresh_data();
      this.loginInfo = new User();
    });
  }

  refresh_data(){
    this.authorizationService.get_users().subscribe(users => {
      this.all_users = users;
      this.router.navigateByUrl('');
    });
  }

  login_user(luser: User) {
    console.log(luser);
    this.authorizationService.login(luser).subscribe( ()=> {
      this.router.navigateByUrl('home');
    })
  }

  // logout_user(){
  //   this.authorizationService.logout().subscribe( ()=> {
  //     this.router.navigateByUrl('');
  //   })
  // }
}
