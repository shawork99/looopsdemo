import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth} from '../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Token } from '../services/token';


@Component({
  selector: 'app-component-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './component-navbar.html',
  styleUrls: ['./component-navbar.css'] 
})

export class ComponentNavbar {
  public user: any;
  public loggedIn:Boolean = false;
  
  constructor(private auth:Auth, private router:Router , private token:Token){}

  ngOnInit(): void{
    this.user = this.token.getUser();
    this.auth.authStatus.subscribe(
      value=>{
        this.loggedIn = value;
      }
    );
  }

  logout(event:MouseEvent){
      event.preventDefault();
      this.token.remove();
      this.auth.changeAuthStatus(false);
      this.router.navigateByUrl('/login');


    }

}
