import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { TitleService } from './services/title.service'
import {NgxSpinnerComponent} from "ngx-spinner";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NgxSpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'

  })
export class AppComponent {
  title = 'hando-angular'
  private titleService = inject(TitleService)

  ngOnInit(): void {
    this.titleService.init()
  }
}
