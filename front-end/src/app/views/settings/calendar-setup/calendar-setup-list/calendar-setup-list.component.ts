import { Component, inject, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core/index.js'
import { Store } from '@ngrx/store'
import listPlugin from '@fullcalendar/list'
import interactionPlugin, {
  DateClickArg,
  Draggable,
} from '@fullcalendar/interaction';
import Swal from "sweetalert2";
import { Subject, takeUntil} from "rxjs";
import { NgxSpinnerService} from "ngx-spinner";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { CalendarSetupFormComponent } from '@views/settings/calendar-setup/calendar-setup-form/calendar-setup-form.component';
import { CalendarSetupEvent } from '@store/calendar_steup/calendar_setup.model';
import { selectCalendarSetupEvents} from "@store/calendar_steup/calendar_setup.selector";
import {loadCalendarSetupEvents, showHideCalendarSetupForm, deleteCalendarSetup} from "@store/calendar_steup/calendar_setup.actions";
import { deleteCalendar } from '@store/calendar/calendar.actions';

@Component({
  selector: 'app-calendar-setup-list',
  imports: [BreadcrumbComponent, FullCalendarModule],
  templateUrl: './calendar-setup-list.component.html',
  styleUrl: './calendar-setup-list.component.scss'
})
export class CalendarSetupListComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarEvents: CalendarSetupEvent[] = [];
  private destroy$ = new Subject<void>();
  private modalService = inject(NgbModal);
  deleteCalendarSetupId: number;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, listPlugin, interactionPlugin, timeGridPlugin],
    headerToolbar: {
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      center: 'title',
      left: 'prev,next today',
    },
    bootstrapFontAwesome: false,
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List',
      prev: 'Prev',
      next: 'Next',
    },
    themeSystem: 'bootstrap',
    initialView: 'dayGridMonth',
    weekends: true,
    weekNumbers: true,
    initialEvents: this.calendarEvents,
    droppable: false,
    editable: true,
    selectable: true,
    eventContent: this.renderEventContent.bind(this),
    eventDidMount: this.eventDidMount.bind(this),
  };

  constructor(
    config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private store: Store
  ){
    this.store.select(selectCalendarSetupEvents).pipe(
      takeUntil(this.destroy$)
    ).subscribe(events => {
      if (events?.length) {
        const mapped = events.map(event => ({
          ...event,
          id: String(event.id),
        }));
        this.calendarEvents = mapped;
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.calendarEvents,
        };
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(loadCalendarSetupEvents());

    this.store.select(selectCalendarSetupEvents).pipe(
      takeUntil(this.destroy$)
    ).subscribe(events => {
      if (events?.length) {
        const mappedEvents = events.map(event => ({
          ...event,
          id: String(event.id)
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events: mappedEvents
        };
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllCalendarSetup(): void {
    this.store.dispatch(loadCalendarSetupEvents());
  }
  goToAdd(){
    const modalRef = this.modalService.open(CalendarSetupFormComponent, {size: 'lg'});
    this.store.dispatch(showHideCalendarSetupForm({show: true}));
    modalRef.componentInstance.modalHeader = 'Add Calendar Setup';
    modalRef.result.then((data) => {
      this.getAllCalendarSetup();
    });
  }
  renderEventContent(arg: any) {
    const viewType = arg.view.type;
    if (!viewType.startsWith('list')) {
      return { domNodes: [document.createTextNode(arg.event.title)] };
    }

    const event = arg.event;
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${event.title}</span>
        <span>
          <button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-id="${event.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${event.id}">Delete</button>
        </span>
      </div>
    `;

    return { domNodes: [container] };
  }

  eventDidMount(info: any) {
    console.log('Im here');
    const viewType = info.view.type;
    if (!viewType.startsWith('list')) {
      return;
    }

    const editBtn = info.el.querySelector('.fc-edit-btn');
    const deleteBtn = info.el.querySelector('.fc-delete-btn');

    if (editBtn) {
      editBtn.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        this.onEditEvent(info.event);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        this.showDeleteAlert(info.event);
      });
    }
  }


  onEditEvent(event: any) {
    console.log('Im here 2');
    (document.activeElement as HTMLElement)?.blur();
    const modalRef = this.modalService.open(CalendarSetupFormComponent, { size: 'lg' });
    this.store.dispatch(showHideCalendarSetupForm({show: true}));
    modalRef.componentInstance.modalHeader = 'Edit Calendar Setup';
    modalRef.componentInstance.editCalendarSetupId = event.id; // pass the event ID
    modalRef.result.then((data) => {
      this.getAllCalendarSetup();
      const calendarApi = this.calendarComponent?.getApi();
      calendarApi?.changeView('listMonth'); // or 'dayGridMonth'
      calendarApi?.refetchEvents();
    });
  }

  showDeleteAlert(event: any) {
      this.deleteCalendarSetupId = event.id;
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonColor: '#d33',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this.onDeleteEvent();
        } else {
          this.deleteCalendarSetupId = undefined;
        }
      });
    }

  onDeleteEvent() {
    this.store.dispatch(deleteCalendarSetup({data: this.deleteCalendarSetupId}));
  }

  ngAfterViewInit() {
    document.addEventListener('click', (event: any) => {
      const target = event.target;
      const action = target?.dataset?.action;
      const id = target?.dataset?.id;

      if (!action || !id) return;
      const calendarEvent = this.calendarEvents.find(e => String(e.id) === id);
      if (!calendarEvent) return;

      event.stopPropagation();

      if (action === 'edit') {
        this.onEditEvent(calendarEvent);
      } else if (action === 'delete') {
        this.showDeleteAlert(calendarEvent);
      }
    });
  }

}
