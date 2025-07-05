import { Component, OnInit } from '@angular/core';
import { Token } from '../../services/token';
import { CommonModule } from '@angular/common';
import { Crdurl } from '../../services/crdurl';
import { Crdpost } from '../../services/crdpost'
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports:[CommonModule,RouterModule,FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class Create implements OnInit{
  public user: any;
  posts: Crdpost[] = [];
  title = '';
  details = '';
  userID = '';
  error = '';


    constructor(private token: Token,private crdurl:Crdurl , private router: Router) {}

   ngOnInit(): void {
        this.user = this.token.getUser();

        if (this.user && this.user.id) {
          this.userID = this.user.id;
        } else {
          this.error = 'User is not authenticated or user ID is missing.';
        }

        this.crdurl.getPosts().subscribe((data: Crdpost[]) => {
          this.posts = data;
        });
    }


   submit() {
      if (!this.title || !this.details || !this.userID) {
        this.error = "All fields including user ID are required.";
        return;
      }

      const input = {
        title: this.title,
        details:this.details,
        userID: this.userID,
        id:1
      };

      this.crdurl.creatPost(input).subscribe();


       alert("Item Created");
       this.router.navigate(['profile'])
  }

}
