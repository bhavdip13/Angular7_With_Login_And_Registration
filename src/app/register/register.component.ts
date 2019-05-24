import { Component, OnInit } from '@angular/core';
import { ToastConfig, Toaster, ToastType } from "ngx-toast-notifications";
import { LoginService } from '../_services/login.service';

import { Observable } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import { Register } from '../_models/register';
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    // return null if controls haven't initialised yet
    if (!control || !matchingControl) {
      return null;
    }

    // return null if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  data = false;
  UserForm: FormGroup;
  massage: string;
  submitted = false;
  // City Names
  City: any = ['Florida', 'South Dakota', 'Tennessee', 'Michigan']
  public imagePath;
  imgURL: any;
  public image_message: string;
  radioSelected: string;
  Skills: string;


  constructor(private formbulider: FormBuilder, private loginService: LoginService, private toaster: Toaster) {

    //create daysFormGroup using FormGroup long-hand syntax
    //this is so I can create a dynamic form from the array of IDay objects


    this.radioSelected = "Male";
    this.Skills = "";
    this.UserForm = this.formbulider.group({
      Password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email],  Validators.composeAsync([
        this.EmailTaken(this.loginService)])], 
      ContactNo: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(12)]],
      City: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      site: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      Gender: [],
      skills: [],
      profile: ['', Validators.required]

    },
      {
        validator: MustMatch('Password', 'confirmPassword')
      });


  }
   EmailTaken(userService: LoginService) {
    return control => new Promise((resolve) => {
        setTimeout(() => {
            userService.isEmailRegisterd(control.value).subscribe(data => {
                if (data == false) {
                    resolve({ EmailTaken: true });
                } else {
                    resolve(null);
                }
            }, (err) => {
                if (err !== "404 - Not Found") {
                    resolve({ EmailTaken: true });
                } else {
                    resolve(null);
                }
            });
        }, 1000);
    });
}

 

  GetSkill(e) {
    
    if (e.target.checked == true) {

      this.Skills += e.target.defaultValue + ",";

    }
  }

  ngOnInit() {
  }
  // Choose city using select dropdown
  // changeCity(e) {
  //   console.log(e.value)
  //   this.cityName.setValue(e.target.value, {
  //     onlySelf: true
  //   })
  // }

  // Getter method to access formcontrols
  // get cityName() {
  //   return this.UserForm.get('cityName');
  // }


  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    var reader = new FileReader();
    this.imagePath = files;

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.UserForm.get('profile').setValue(reader.result);

    }
    if (mimeType.match(/image\/*/) == null) {
      this.image_message = "Only images are supported.";
      this.imgURL = '';
      return;
    }
    else {
      this.image_message = "";
      this.imgURL = '';
      return;
    }
  }


  // convenience getter for easy access to form fields
  get f() { return this.UserForm.controls; }

  onFormSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.UserForm.invalid) {
      return;
    }

    const user = this.UserForm.value;
    user.skills = this.Skills.replace(/,\s*$/, "");
    
    this.Createemployee(user);
   
  }

  Createemployee(register: Register) {

    this.loginService.CreateUser(register).subscribe(
      () => {

        this.data = true;
        this.toaster.open({
          text: 'User registration successfully, please go to login page.',
          caption: 'Success notification',
          type: 'success'
        });
        // this.massage = 'Data saved Successfully';    
       
        this.UserForm.reset();
        this.imgURL = '';
        this.submitted = false;

      });
  }
}


