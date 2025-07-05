import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentNavbar } from "./component-navbar/component-navbar";
import { RouterModule } from '@angular/router';
import { FormsModule} from'@angular/forms';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ComponentNavbar,RouterModule,FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'front-end';
}
