import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.css']
})
export class NavigationHeaderComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService,
    private router: Router) { }

  ngOnInit() {
  }

  logout(){
    this.authorizationService.logout().subscribe( ()=> {
      this.router.navigateByUrl('');
    })
  }
}
