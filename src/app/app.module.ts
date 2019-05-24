import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ToastNotificationsModule } from "ngx-toast-notifications";
import { GridModule,ExcelModule,PDFModule  } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import * as $ from 'jquery';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ConfirmationdialogComponent } from './confirmationdialog/confirmationdialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
   ConfirmationdialogComponent
     ],

  imports: [
 
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastNotificationsModule.forRoot(),
    GridModule,
    ExcelModule,
    PDFModule,
    BrowserAnimationsModule,
    InputsModule,
    ExcelExportModule,
    PDFExportModule,
    PopupModule,
    NgbModule.forRoot()
  ],
  providers: [],
  entryComponents: [ConfirmationdialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
