import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toaster } from 'ngx-toast-notifications';
import { filterBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { ConfirmationdialogService } from '../confirmationdialog/confirmationdialog.service';
import { Register } from '../_models/register';

declare var $: any;
const flatten = filter => {
  const filters = (filter || {}).filters;
  if (filters) {
    return filters.reduce((acc, curr) => acc.concat(curr.filters ? flatten(curr) : [curr]), []);
  }
  return [];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public gridData: any[];
  public AllgridData: any[];

  _UserList: Array<Object> = [];

  data = false;
  UserForm: FormGroup;
  massage: string;
  submitted = false;
  // City Names
  City: any = ['Florida', 'South Dakota', 'Tennessee', 'Michigan']
  public imagePath;
  imgURL: any;
  public imgURL2: boolean;

  public image_message: string;
  radioSelected: string;
  Skills: string;
  IsAsp_Net: string;
  IsPHP: string;
  IsJava: string;
  IsSQL: string;
  IsOracle: string;

  public checked = false;
  public filter: CompositeFilterDescriptor;
   public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridData = filterBy(this.AllgridData, filter);
  }

  constructor(private formbulider: FormBuilder, private Loginservice: LoginService, private toaster: Toaster, private confirmationDialogService: ConfirmationdialogService) {
    this.imgURL2 = true;
    this.Skills = "";
    this.UserForm = this.formbulider.group({
      Password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      ContactNo: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      site: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      Gender: [],
      skills: [],
      profile: ['', Validators.required],

    });

    this.GetAlluserData();
  }

  GetAlluserData() {
    return this.Loginservice.GetAllUser().subscribe((res: any[]) => {

      for (let i = 0; i < res.length; i++) {
        res[i].Profile = "data:image/jpg;base64," + res[i].Profile;
        res[i].Dob = new Date(res[i].Dob);
      }

      this.gridData = res;
      this.AllgridData = res;

    });
  }
  public switchChange(checked: boolean): void {
    const root = this.filter || { logic: "and", filters: [] };

    const [filter] = flatten(root).filter(x => x.field === "IsApporved");

    if (!filter) {
      debugger
      root.filters.push({
        field: "IsApporved",
        operator: "eq",
        value: 1
      });
    } else {
      if (checked)
        filter.value = 1;
      else
        filter.value = 0;

    }
    debugger
    this.checked = checked;
    this.filterChange(root);
  }
  ShowUpdateModalPopup(dataItem) {

    this.imgURL = '';
    this.UserForm = this.formbulider.group({
      Email: dataItem[0].Email,
      ContactNo: dataItem[0].ContactNo,
      City: dataItem[0].City,
      Address: dataItem[0].Address,
      site: dataItem[0].site,
      dob: '',
      Gender: dataItem[0].Gender,
      skills: dataItem[0].skills,
      profile: dataItem[0].Profile,
      UserId: dataItem[0].UserId

    });


    var skills_string = dataItem[0].Skills;
    var skillsArray = skills_string.split(",");

    if (skillsArray.includes('Asp.Net'))
      $('input[value="Asp.Net"]').prop('checked', true);

    if (skillsArray.includes('PHP'))
      $('input[value="PHP"]').prop('checked', true);

    if (skillsArray.includes('Java'))
      $('input[value="Java"]').prop('checked', true);

    if (skillsArray.includes('SQL'))
      $('input[value="SQL"]').prop('checked', true);

    if (skillsArray.includes('Oracle'))
      $('input[value="Oracle"]').prop('checked', true);

    this._UserList = dataItem;

    $("#UserModal").modal('show');
  }
  preview(files) {
    this.imgURL2 = false;
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
    debugger
    const user = this.UserForm.value;
    user.skills = this.Skills.replace(/,\s*$/, "");
    this.UpdateUser(user);
  }
  GetSkill(e) {

    if (e.target.checked == true) {

      this.Skills += e.target.defaultValue + ",";

    }
  }
  UpdateUser(register: Register) {
    this.Loginservice.UpdateUser(register).subscribe(
      () => {

        this.data = true;
        $("#UserModal").modal('hide');
        this.toaster.open({
          text: 'User Updated successfully.',
          caption: 'Success notification',
          type: 'success'
        });
        // this.massage = 'Data saved Successfully';    
        this.UserForm.untouched;
        this.UserForm.reset();
        this.imgURL = '';
        this.GetAlluserData();
      });
  }
  public openConfirmationDialog(UserId) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this recored ?')
      .then((confirmed) => {
        if (confirmed)
          this.DeleteUser(UserId)
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  DeleteUser(UserId) {
    this.Loginservice.DeleteUser(UserId).subscribe(
      () => {
        this.data = true;
        this.toaster.open({
          text: 'User Deleted successfully.',
          caption: 'Success notification',
          type: 'success'
        });

        this.GetAlluserData();
      });
  }
  Cancel() {
    this.UserForm.untouched;
    this.UserForm.reset();
    this.imgURL = '';
    this.imgURL2 = true;

  }
  ngOnInit() {

  }
}
