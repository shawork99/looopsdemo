import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subject, takeUntil } from "rxjs";
import { CalendarSetup } from "@store/calendar_steup/calendar_setup.model";
import {
  selectEditCalendarSetupDetails,
  selectShowHideCalendarSetupForm,
  selectShowCalendarSetupFormLoading
} from "@store/calendar_steup/calendar_setup.selector";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "@/app/services/alert.service";
import { 
  createCalendarSetup,
  getEditCalendarSetupDetails,
  showCalendarSetupFormLoading, 
  updateCalendarSetup
} from "@store/calendar_steup/calendar_setup.actions";
import { FormErrorsPipe } from "@/app/shared/pipes/form-errors.pipe";

@Component({
  selector: 'app-calendar-setup-form',
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgClass,
    NgTemplateOutlet,
    FormErrorsPipe
  ],
  templateUrl: './calendar-setup-form.component.html',
  styleUrl: './calendar-setup-form.component.scss'
})
export class CalendarSetupFormComponent {
  public store = inject(Store);
  submitted = false;
  form: FormGroup;
  editCalendarSetupId: number;
  editCalenderSetup: CalendarSetup;
  private destroy$ = new Subject<void>();
  modalHeader: string;
  isLoading$ = this.store.select(selectShowCalendarSetupFormLoading);

  constructor(
    public modal: NgbActiveModal,
    private alertService: AlertService
  ){
    this.store.select(selectShowHideCalendarSetupForm).pipe(
      takeUntil(this.destroy$)
    ).subscribe((show) => {
      if (!show) {
        this.modal.close()
      }
    });
  }

  ngOnInit(): void {
    if (this.editCalendarSetupId) {
      this.store.dispatch(getEditCalendarSetupDetails({calendarSetupId: this.editCalendarSetupId}));
      this.store.select(selectEditCalendarSetupDetails).pipe(
        takeUntil(this.destroy$)
      ).subscribe((calenderSetup: CalendarSetup) => {
        if (calenderSetup) {
          this.editCalenderSetup = calenderSetup;
          this.initForm();
        }
      });
    } else {
      this.initForm();
    }
  }

  private initForm() {
    if(this.editCalendarSetupId){
      this.form = new FormGroup({
        id: new FormControl(this.editCalenderSetup.id || null),
        title: new FormControl(this.editCalenderSetup.title || '', [Validators.required, Validators.maxLength(50)]),
        date: new FormControl(this.editCalenderSetup.date || null, Validators.required),
        event_type: new FormControl(this.editCalenderSetup.event_type || null, Validators.required),
      });
    } else {
      this.form = new FormGroup({
        id: new FormControl(null),
        title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        date: new FormControl(null, Validators.required),
        event_type: new FormControl('event', Validators.required),
      });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit(){
    this.submitted = true;
    this.form.markAsTouched();
    if (this.form.invalid) {
      this.alertService.showError("Please fill all the required fields");
      return;
    }
    this.store.dispatch(showCalendarSetupFormLoading({show: true}));
    const payload = this.form.getRawValue();
    if (this.editCalenderSetup) {
      this.store.dispatch(updateCalendarSetup({calendarSetupId: this.editCalenderSetup?.id, data: payload}));
    } else {
      this.store.dispatch(createCalendarSetup({data: payload}));
    }
  }
}
