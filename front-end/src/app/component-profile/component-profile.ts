import { Component, OnInit } from '@angular/core';
import { Token } from '../services/token';
import { CommonModule } from '@angular/common';
import { Crdurl } from '../services/crdurl';
import { Crdpost } from '../services/crdpost'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-component-profile',
  imports:[CommonModule,RouterModule],
  templateUrl: './component-profile.html',
  styleUrl: './component-profile.css'
})


export class ComponentProfile implements OnInit {
  public user: any;
  posts: Crdpost[] = [];

  constructor(private token: Token,private crdurl:Crdurl) {}

  ngOnInit() : void{
    this.user = this.token.getUser();
     this.loadpost();
  }

  deletePost(id: number){
    if(confirm("are you sure to delete this record?")){
      this.crdurl.deletePost(id).subscribe(()=>{
        this.loadpost();
      })
    }

  }

  loadpost(){
    this.crdurl.getPosts().subscribe((data: Crdpost[])=> {
        this.posts = data;
        
        }) 
  }

}
