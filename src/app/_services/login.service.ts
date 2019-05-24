import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Register } from '../_models/register';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  Url: string;
  token: string;
  header: any;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {

    const headerSettings: { [name: string]: string | string[]; } = {};
    this.header = new HttpHeaders(headerSettings);
  }
  Login(model: any) {
    return this.http.post<any>(this.baseUrl + 'UserLogin', model, { headers: this.header });
  }
  CreateUser(register: Register) {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Register[]>(this.baseUrl + '/createcontact/', register, httpOptions)
  }
  UpdateUser(register: Register) {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Register[]>(this.baseUrl + '/UpdateUser/', register, httpOptions)
  }
  DeleteUser(UserId) {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete(this.baseUrl + '/DeleteUser/ ' + UserId, httpOptions)
  }
  GetAllUser() {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get(this.baseUrl + '/GetAllUser/', httpOptions)
  }
  isEmailRegisterd(email: string) {

    let params = new HttpParams();
    params = params.append('email', email);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params };

    return this.http.get(this.baseUrl + '/isEmailRegisterd', httpOptions)
  }

}  