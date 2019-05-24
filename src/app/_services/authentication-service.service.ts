import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Toaster } from 'ngx-toast-notifications';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  Url: string;
  header: any;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private toaster: Toaster) {
    
    
    const headerSettings: { [name: string]: string | string[]; } = {};
    this.header = new HttpHeaders(headerSettings);

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  //   Login(model: any) {
  //     return this.http.post<any>(this.Url + 'UserLogin', model, { headers: this.header });
  // }
  login(Email: string, Password: string) {
    return this.http.post<any>(this.baseUrl + 'UserLogin2?Email=' + Email + '&Password=' + Password, { headers: this.header })
      .pipe(
        map(user => {
          if (user.Status == 'Success') {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }

          }
          else if (user.Status == 'Inactive') {
            this.toaster.open({
              text: 'Sorry this user is not activated, Please contact to administrator.',
              caption: 'warning notification',
              type: 'warning'
            });

          }
          else if (user.Status == 'Invalid') {
            this.toaster.open({
              text: 'Sorry this user is not registred.',
              caption: 'warning notification',
              type: 'warning'
            });

          }
          else if (user.Status == 'MaxLoginTryLimitCross') {
            this.toaster.open({
              text: 'Sorry maximum try limit 5 times, try after some time.',
              caption: 'warning notification',
              type: 'warning'
            });

          }
          
          return user;
        }),
        catchError((error: HttpErrorResponse) => {

          if (error.status === 401) {
            // refresh token
          } else {
            this.toaster.open({
              text: error.message,
              caption: 'Error notification',
              type: 'danger'
            });
            return throwError(error);
          }
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

  }
}
