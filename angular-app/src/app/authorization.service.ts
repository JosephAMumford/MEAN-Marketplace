import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie';

import { User } from "./user";

@Injectable()
export class AuthorizationService {

  private userBase = '/users';

  users: User[] = [];

  current_user = { active: false, username: "", user_id: 0 }

  constructor(
    private _http: HttpClient,
    private _cookieService: CookieService) { }


  login(user: User){
    console.log("Service loggin in");
    return this._http.post('/auth/login', user);
  }

  register(user: User) {
    return this._http.post('/auth/register', user);
  }

  logout() {
    return this._http.delete('/auth/logout');
  }

  isAuthed(): boolean {
    const expired = parseInt(this._cookieService.get('expiration'),10);
    const userId = this._cookieService.get('userID');
    const session = this._cookieService.get('session');

    return session && expired && userId && expired > Date.now();
  }

  add_user(user: User): Observable<User> {
    console.log("service registering user");
    return this._http.post<User>(this.userBase, user);
  }

  get_user(id: number){
    //Get user from database
    return new User();
  }

  get_users(): Observable<User[]>{
    return this._http.get<User[]>('all');
  }

  login_user(user: User): Observable<User> {
    //Compare submitted user
    return this._http.post<User>('login',user);
  }

  set_current_user(user: User){
  this.current_user.username = user.first_name + " " + user.last_name;
    this.current_user.user_id = user.user_id;
    this.current_user.active = true;
    console.log(this.current_user);
  }

  //logout(){
  //  this.current_user = { active: false, username: "", user_id: 0 }
  //}
}
