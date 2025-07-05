import { Component } from '@angular/core';
import { FormsModule} from'@angular/forms';
import { Backend} from '../services/backend';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-signup',
  imports: [FormsModule,CommonModule],
  templateUrl: './component-signup.html',
  styleUrl: './component-signup.css'
})
export class ComponentSignup {

  public error:any=[];
  public successMessage: string | null = null;

  public form={
    name:null,
    email:null,
    password:null,
    password_confirmation:null

  }

    constructor( private backend:Backend, private router:Router ){}

  submitRegistration(){
    // console.log(this.form);

    return this.backend.signup(this.form).subscribe(
      data => {
          console.log(data);
          this.successMessage = "Signup successful!";
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        },
      error =>this.handleerror(error)
    );
  }

  handleerror(error:any){
    this.error = error.error.errors;
  }



}
