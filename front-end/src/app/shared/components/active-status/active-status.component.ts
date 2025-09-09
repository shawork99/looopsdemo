import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-active-status',
  imports: [
    NgClass
  ],
  template: `
    <span class="badge" [ngClass]="{
                      'text-bg-success': status == true,
                      'text-bg-danger': status == false
                    }">{{ status ? 'Active' : 'Inactive' }}</span>
  `
})
export class ActiveStatusComponent {
  @Input() status: boolean;
}
