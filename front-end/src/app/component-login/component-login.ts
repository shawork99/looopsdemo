import { Component } from '@angular/core';
import { FormsModule} from'@angular/forms';
import { Backend} from '../services/backend';
import { Token} from '../services/token';
import { Router } from '@angular/router';
import { Auth} from '../services/auth';

@Component({
  selector: 'app-component-login',
  imports: [FormsModule],
  templateUrl: './component-login.html',
  styleUrl: './component-login.css'
})
export class ComponentLogin {
  public error = null;
  

  public form={
    email:null,
    password:null
  }

  constructor( private backend:Backend , private token:Token, private router:Router, private auth:Auth){}

  submitlogin(){
    // console.log(this.form);

    return this.backend.login(this.form).subscribe(
      data   =>this.handleResponse(data),
      error =>this.handleerror(error)

    )
  }

  handleResponse(data:any){
      console.log(data.access_token);
      this.token.handle(data.access_token,data.user);
      this.auth.changeAuthStatus(true);
      this.router.navigateByUrl('/profile');

  }

  handleerror(error:any){
    this.error = error.error.error;

  }

}
