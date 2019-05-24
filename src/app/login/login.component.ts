import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationServiceService } from '../_services/authentication-service.service';
import { ToastConfig, Toaster, ToastType } from "ngx-toast-notifications";
import { debug } from 'util';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  loading = false;
  submitted = false;



  errorMessage: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationServiceService,
    private toaster: Toaster

  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/Dashboard']);
    }
  }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      Email: ['', [Validators.required,Validators.email]],
      Password: ['',[Validators.required, Validators.minLength(6)]]
    });

    
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.Email.value, this.f.Password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.Status == 'Success') {
          this.router.navigate(['/Dashboard']);

          }
          this.loading = false;
        },
        error => {
         
          this.loading = false;
        }
      )
  };

}   