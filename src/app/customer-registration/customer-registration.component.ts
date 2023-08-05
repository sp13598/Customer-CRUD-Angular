import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.scss']
})
export class CustomerRegistrationComponent implements OnInit {

  public contract = ["Signed", "In Progress", "Not Signed Yet"];
  public registerForm! : FormGroup; 
  public idToUpdate!: number;
  public isUpdateActive : boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toast: NgToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      mobile: [''],
      project: [''],
      sale_contact: [''],
      status: [''],
      golivedate: [''],
    })

    this.activatedRoute.params.subscribe(val => {
      this.idToUpdate = val['id'];
      this.api.getCustomerById(this.idToUpdate).subscribe(res => {
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
      })
    })

  }

  submit(){
    this.api.saveCustomer(this.registerForm.value).subscribe(res => {
      this.toast.success({ detail: 'Success', summary: 'Customer Added Successfully', duration: 3000 });
      this.registerForm.reset();
    })
  }
  
  update(){
    this.api.updateCustomer(this.registerForm.value, this.idToUpdate).subscribe(res => {
      this.toast.success({ detail: 'Success', summary: 'Customer Updated Successfully', duration: 3000 });
      this.registerForm.reset();
      this.router.navigate(['list'])
    })
  }

  fillFormToUpdate(customer: Customer){
    this.registerForm.setValue({
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
      project: customer.project,
      sale_contact: customer.sale_contact,
      status: customer.status,
      golivedate: customer.golivedate,
    })
  }
  
}
