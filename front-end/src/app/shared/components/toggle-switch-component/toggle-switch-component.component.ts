import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-toggle-switch-component',
  template: `
    <div class="form-check form-switch mb-2">
      <input
          style="width: 45px;height: 23px;"
          class="form-check-input"
          type="checkbox"
          role="switch"
          [(ngModel)]="value"
          (ngModelChange)="onValueChangeHandler()"
          id="flexSwitchCheckDefault"
      />
    </div> 
  `,
  imports: [
    FormsModule
  ]
})
export class ToggleSwitchComponentComponent {
  @Input() value: boolean = false;
  @Output() onValueChange = new EventEmitter<boolean>();

  onValueChangeHandler() {
    this.onValueChange.emit(this.value);
  }
}
