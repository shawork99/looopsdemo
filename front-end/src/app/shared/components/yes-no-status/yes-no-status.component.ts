import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-yes-no-status',
  imports: [
    NgClass
  ],
  template: `
    <span class="badge" [ngClass]="{
                      'text-bg-success': yesNo == true,
                      'text-bg-danger': yesNo == false
                    }">{{ yesNo ? 'Yes' : 'No' }}</span>
  `
})
export class YesNoStatusComponent {
  @Input() yesNo: boolean;
}
