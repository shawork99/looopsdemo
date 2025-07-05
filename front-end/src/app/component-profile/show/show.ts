import { CommonModule } from '@angular/common';
import { Token } from '../../services/token';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Crdurl } from '../../services/crdurl';
import { Crdpost } from '../../services/crdpost';

@Component({
  selector: 'app-show',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './show.html',
  styleUrl: './show.css'
})
export class Show {

    public user: any;
    posts: Crdpost[] = [];
    title = '';
    details = '';
    userID = '';
    error = '';
    id = '';
  


   constructor(private token: Token,private crdurl:Crdurl , private route: ActivatedRoute) {}

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

        // this.crdurl.getPosts().subscribe((data: Crdpost[]) => {
        //   this.posts = data;
        // });
    }



}
