import { Component, OnInit } from '@angular/core';
import { Token } from '../../services/token';
import { CommonModule } from '@angular/common';
import { Crdurl } from '../../services/crdurl';
import { Crdpost } from '../../services/crdpost'
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
   imports:[CommonModule,RouterModule,FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit {

  public user: any;
  posts: Crdpost[] = [];
  title = '';
  details = '';
  userID = '';
  error = '';
  id = '';


    constructor(private token: Token,private crdurl:Crdurl , private router: Router, private route: ActivatedRoute) {}

   ngOnInit(): void {
        this.user = this.token.getUser();
        this.id = this.route.snapshot.params['postId'];
        this.crdurl.findPost(this.id).subscribe((crdpost : Crdpost) => {

        this.title = crdpost.title;
        this.details = crdpost.details;
        });

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

      this.crdurl.updatePost(this.id, input).subscribe();
       alert("Item Updated");
       this.router.navigate(['profile'])
  }


}
