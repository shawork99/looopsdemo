import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AsyncPipe, NgClass, NgIf, NgFor } from "@angular/common";


@Component({
  selector: 'app-leave-application-form',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgClass,
    NgIf,
    NgFor
  ],
  templateUrl: './leave-application-form.component.html',
  styleUrl: './leave-application-form.component.scss'
})
export class LeaveApplicationFormComponent {
  modalHeader: string;
  leaveForm: FormGroup;
  leaveTypes = [
    { id: 1, name: 'Annual Leave', balance: 6 },
    { id: 2, name: 'Sick Leave', balance: 4 },
  ];
  availableBalance = 0;
  appliedDays = 0;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder
  ){
   this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      isShortLeave: [false],
      session: [''],
      comments: [''],
      attachment: [null]
    });
  }
  onLeaveTypeChange() {
    const selected = this.leaveTypes.find(t => t.id == this.leaveForm.get('leaveType')?.value);
    this.availableBalance = selected ? selected.balance : 0;
    this.calculateDays();
  }

  isSameDay(): boolean {
    const from = this.leaveForm.get('fromDate')?.value;
    const to = this.leaveForm.get('toDate')?.value;
    return from && to && from === to;
  }

  calculateDays() {
    const from = new Date(this.leaveForm.get('fromDate')?.value);
    const to = new Date(this.leaveForm.get('toDate')?.value);

    if (from && to && from <= to) {
      const diff = (to.getTime() - from.getTime()) / (1000 * 3600 * 24) + 1;
      this.appliedDays = this.leaveForm.get('isShortLeave')?.value ? 0.5 : diff;
    } else {
      this.appliedDays = 0;
    }
  }

  submitForm() {
    if (this.leaveForm.valid && this.appliedDays <= this.availableBalance) {
     
    }
  }

}
