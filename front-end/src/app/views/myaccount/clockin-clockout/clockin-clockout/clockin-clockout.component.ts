import { Component, inject, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from "rxjs";
import { ActiveStatusComponent } from "@/app/shared/components/active-status/active-status.component";
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf, JsonPipe, NgClass, formatDate } from "@angular/common";
import { TranslocoPipe } from "@jsverse/transloco";
import { NgbPagination, NgbPaginationNext, NgbPaginationPrevious } from "@ng-bootstrap/ng-bootstrap";

import { selectProfileStatus, selectClockinoutDetails , selectOtherWishes, selectUserWishes, selectAttanedanceStatus, selectallinandoutdata} from '@/app/store/clockin-clockout/clockin_clockout.selector';
import { loadprfiledata, clockIn, clockOut, loadClockinoutDetails, clockInSuccess, clockOutSuccess, loadattandacestsatus, loadallinandout,loadWishes } from '@/app/store/clockin-clockout/clockin_clockout.action';
import { AttendanceStatusEntry, load_profile } from '@/app/store/clockin-clockout/clockin_clockout.model';
import { CalendarComponent } from '@/app/views/apps/calendar/calendar.component';
import Swal from "sweetalert2";

interface RawInOut {
  id: number;
  action_type: 'clock_in' | 'clock_out';
  action_time: string; // "2025-09-06 11:34:57"
}

interface Session {
  index: number;
  inRecord?: RawInOut;
  outRecord?: RawInOut | null;
  inTimeDisplay: string;
  outTimeDisplay: string;
  durationMinutes?: number | null; // null for still working
  durationDisplay: string;
  isOngoing: boolean;
}

@Component({
  selector: 'app-clockin-clockout',
  templateUrl: './clockin-clockout.component.html',
  styleUrls: ['./clockin-clockout.component.scss'],
  standalone: true,
  imports: [
    ActiveStatusComponent,
    BreadcrumbComponent,
    FormsModule,
    CalendarComponent,
    NgForOf,
    NgIf,
    NgClass,
    JsonPipe,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious,
    TranslocoPipe
  ]
})
export class ClockinClockoutComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();
  @ViewChild('sessionsModal') sessionsModal!: TemplateRef<any>;


  otherCelebrantsMessage: string | null = null;
  userMessage: string | null = null;

  loadprofile: load_profile = null;
  buttonText: string = 'Clock In';
  comment: string = '';

  clockInTime: string = '--:--';
  clockOutTime: string = '--:--';
  workedHours: string = '-- hr -- min';

  attendanceStatuses: AttendanceStatusEntry[] = [];

  // all in/out raw items for today
  allInOutRaw: RawInOut[] = [];

  // processed sessions for modal
  sessions: Session[] = [];
  totalWorkedMinutes: number = 0;
  totalWorkedDisplay: string = '-- hr -- min';
  includesOngoingInTotal: boolean = false;

  constructor(
    config: NgbModalConfig,
    private store: Store,
    private actions$: Actions
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.store.dispatch(loadWishes());
    this.store.dispatch(loadprfiledata({ load_profile: null }));
    this.store.dispatch(loadClockinoutDetails());
    this.store.dispatch(loadattandacestsatus());

    // load the all in/out list for the day
    this.store.dispatch(loadallinandout());

    this.store.select(selectProfileStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ profile, loading }) => {
        this.loadprofile = profile;
      });

    this.store.select(selectClockinoutDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe((details) => {
        const setNotClockedIn = () => {
          this.clockInTime = 'Not clocked-in';
          this.clockOutTime = 'Not clocked-in';
          this.workedHours = 'Not clocked-in';
          this.buttonText = 'Clock In';
        };

        if (details && details.length > 0) {
          const latest = details[0];
          const secondLatest = details[1];

          const isSameDate = (d1: Date, d2: Date) => {
            return d1.getFullYear() === d2.getFullYear()
              && d1.getMonth() === d2.getMonth()
              && d1.getDate() === d2.getDate();
          };

          const today = new Date();
          const latestDate = latest && latest.action_time ? new Date(latest.action_time) : null;

          if (!latestDate || !isSameDate(latestDate, today)) {
            setNotClockedIn();
            return;
          }

          if (latest.action_type === 'clock_in') {
            const clockInDate = latestDate;
            this.clockInTime = formatDate(clockInDate, 'hh:mm a', 'en-US');
            this.clockOutTime = 'Still Working';
            this.workedHours = 'Still Working';
            this.buttonText = 'Clock Out';

          } else if (latest.action_type === 'clock_out' && secondLatest?.action_type === 'clock_in') {
            const secondLatestDate = secondLatest.action_time ? new Date(secondLatest.action_time) : null;
            if (!secondLatestDate || !isSameDate(secondLatestDate, today)) {
              setNotClockedIn();
              return;
            }

            const clockInDate = secondLatestDate!;
            const clockOutDate = latestDate;

            this.clockInTime = formatDate(clockInDate, 'hh:mm a', 'en-US');
            this.clockOutTime = formatDate(clockOutDate, 'hh:mm a', 'en-US');
            this.workedHours = this.calculateWorkedHours(clockInDate, clockOutDate);
            this.buttonText = 'Clock In';

          } else {
            setNotClockedIn();
          }
        } else {
          this.clockInTime = '--:--';
          this.clockOutTime = '--:--';
          this.workedHours = '-- hr -- min';
          this.buttonText = 'Clock In';
        }
      });

    this.store.select(selectAttanedanceStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe((payload: any) => {
        if (!payload) {
          this.attendanceStatuses = [];
          return;
        }

        let statuses: AttendanceStatusEntry[] = [];

        if (Array.isArray(payload)) {
          statuses = payload as AttendanceStatusEntry[];
        } else if (payload.status) {
          if (typeof payload.status === 'string') {
            try {
              statuses = JSON.parse(payload.status) as AttendanceStatusEntry[];
            } catch (e) {
              statuses = [];
            }
          } else if (Array.isArray(payload.status)) {
            statuses = payload.status as AttendanceStatusEntry[];
          }
        } else {
          if (typeof payload === 'string') {
            try {
              statuses = JSON.parse(payload) as AttendanceStatusEntry[];
            } catch (e) {
              statuses = [];
            }
          }
        }

        const todayStr = new Date().toISOString().slice(0, 10);
        this.attendanceStatuses = statuses.filter(s => s && s.date === todayStr);
      });

    // subscribe to all-in-and-out data from store
    this.store.select(selectallinandoutdata)
      .pipe(takeUntil(this.destroy$))
      .subscribe((payload: any) => {
        // payload expected as array of { id, action_type, action_time }
        const raw: RawInOut[] = Array.isArray(payload) ? payload : (payload?.data ?? []);
        // keep only today's records (compare dates)
        const todayStr = new Date().toISOString().slice(0, 10);
        this.allInOutRaw = (raw || []).filter(r => {
          if (!r?.action_time) return false;
          return r.action_time.slice(0, 10) === todayStr;
        }).sort((a, b) => a.action_time.localeCompare(b.action_time)); // ascending
        // process into sessions
        this.processSessions();
      });

    this.actions$.pipe(
      ofType(clockInSuccess, clockOutSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(loadClockinoutDetails());
      this.store.dispatch(loadattandacestsatus());
      this.store.dispatch(loadallinandout());
      setTimeout(() => {
        window.location.reload();
      }, 150);
    });
    
    this.store.select(selectOtherWishes)
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg =>{  console.log('Other Wishes:', msg);
        this.otherCelebrantsMessage = msg});

    this.store.select(selectUserWishes)
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg =>{  console.log('User Wishes:', msg);
        this.userMessage = msg});

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openClockConfirm() {
    const action = this.buttonText === 'Clock In' ? 'Clock In' : 'Clock Out';
    const confirmText = this.buttonText;

    Swal.fire({
      title: `Are you sure?<br><span style="font-size:14px;">You want to ${action}?</span>`,
      input: 'textarea',
      inputPlaceholder: 'Add a comment (optional)...',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      icon: 'question',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      preConfirm: (inputValue) => inputValue
    }).then((result) => {
      if (result.isConfirmed && this.loadprofile) {
        this.comment = result.value || '';

        if (this.buttonText === 'Clock In') {
          this.store.dispatch(clockIn({
            userId: this.loadprofile.id,
            comment: this.comment
          }));
          this.buttonText = 'Clock Out';
        } else {
          this.store.dispatch(clockOut({
            userId: this.loadprofile.id,
            comment: this.comment
          }));
          this.buttonText = 'Clock In';
        }
      }
    });
  }

  // --- Session processing logic ---

  private processSessions() {
    const sessions: Session[] = [];
    let lastIn: RawInOut | null = null;
    let idx = 1;
    // iterate ascending
    for (const rec of this.allInOutRaw) {
      if (rec.action_type === 'clock_in') {
        // start a new in
        lastIn = rec;
      } else if (rec.action_type === 'clock_out') {
        if (lastIn) {
          // pair and push
          const inRec = lastIn;
          const outRec = rec;
          const durationMin = this.computeMinutesBetween(inRec.action_time, outRec.action_time);
          sessions.push({
            index: idx++,
            inRecord: inRec,
            outRecord: outRec,
            inTimeDisplay: this.formatTime(inRec.action_time),
            outTimeDisplay: this.formatTime(outRec.action_time),
            durationMinutes: durationMin,
            durationDisplay: this.minutesToDisplay(durationMin),
            isOngoing: false
          });
          lastIn = null;
        } else {
          // stray clock_out without prior clock_in — skip it
          continue;
        }
      }
    }

    // if leftover lastIn (ongoing)
    if (lastIn) {
      const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const durationMin = this.computeMinutesBetween(lastIn.action_time, new Date().toISOString());
      sessions.push({
        index: idx++,
        inRecord: lastIn,
        outRecord: null,
        inTimeDisplay: this.formatTime(lastIn.action_time),
        outTimeDisplay: 'Still Working',
        durationMinutes: null,
        durationDisplay: 'Still Working',
        isOngoing: true
      });
    }

    // set sessions and totals
    this.sessions = sessions;
    this.computeTotals();
  }

  // compute minutes between two datetimes (strings or Date)
  private computeMinutesBetween(a: string, b: string | Date): number {
    const ad = new Date(a);
    const bd = (b instanceof Date) ? b : new Date(b);
    const diffMs = bd.getTime() - ad.getTime();
    if (diffMs <= 0) return 0;
    return Math.floor(diffMs / (1000 * 60));
  }

  private formatTime(dtString: string): string {
    try {
      const d = new Date(dtString);
      return formatDate(d, 'hh:mm a', 'en-US');
    } catch {
      return dtString;
    }
  }

  private minutesToDisplay(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h} hr ${m.toString().padStart(2, '0')} min`;
  }

  // total: sum durations; include ongoing's current time if you want
  private computeTotals() {
    let total = 0;
    let includesOngoing = false;
    for (const s of this.sessions) {
      if (s.isOngoing && s.inRecord) {
        // include ongoing duration up to now
        const now = new Date();
        const mins = this.computeMinutesBetween(s.inRecord.action_time, now);
        total += mins;
        includesOngoing = true;
      } else if (s.durationMinutes != null) {
        total += s.durationMinutes;
      }
    }
    this.totalWorkedMinutes = total;
    this.totalWorkedDisplay = this.minutesToDisplay(total);
    this.includesOngoingInTotal = includesOngoing;
  }

  // open modal when user clicks the menu icon
  openSessionsModal() {
    // ensure sessions are up to date
    this.processSessions();
    if (!this.sessionsModal) return;
    this.modalService.open(this.sessionsModal, { size: 'lg', centered: true });
  }

  // --- existing helpers kept unchanged ---

  private calculateWorkedHours(start: Date, end: Date): string {
    if (!start || !end) return '-- hr -- min';
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return '-- hr -- min';
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours} hr ${minutes.toString().padStart(2, '0')} min`;
  }

  private parseTimeToMinutes(timeStr: string): number {
    if (!timeStr || timeStr === '--:--' || timeStr === 'Still Working' || timeStr === 'Not clocked-in') return 0;
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier?.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  private calculateWorkedHoursFromStrings(clockInTime: string, clockOutTime: string): string {
    const startMinutes = this.parseTimeToMinutes(clockInTime);
    const endMinutes = this.parseTimeToMinutes(clockOutTime);
    let diffMinutes = endMinutes - startMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours} hr ${minutes.toString().padStart(2, '0')} min`;
  }



  getStatusesByAction(actionType: 'clock_in' | 'clock_out'): AttendanceStatusEntry[] {
    return this.attendanceStatuses.filter(s => s.action_type === actionType);
  }

  formatStatusTime(ts: string): string {
    try {
      const d = new Date(ts);
      return formatDate(d, 'hh:mm a', 'en-US');
    } catch (e) {
      return ts;
    }
  }

  getBadgeClass(type?: string): string {
    if (!type) return 'badge bg-secondary text-white';

    const key = type.toLowerCase().trim();

    switch (true) {
      case /early in/i.test(key):
        return 'badge bg-success text-white';
      case /late in/i.test(key):
        return 'badge bg-warning text-dark';
      case /early out/i.test(key):
        return 'badge bg-info text-white';
      case /late out/i.test(key):
        return 'badge bg-danger text-white';
      case /absent/i.test(key):
        return 'badge bg-dark text-white';
      case /short leave/i.test(key):
        return 'badge bg-secondary text-white';
      case /half day/i.test(key):
        return 'badge bg-primary text-white';
      case /leave/i.test(key) && !/short leave/i.test(key) && !/half day/i.test(key):
        return 'badge bg-light text-dark';
      case /weekend/i.test(key):
        return 'badge bg-secondary text-white';
      case /holiday/i.test(key):
        return 'badge bg-danger text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  }

  getBadgeLabel(type?: string): string {
    if (!type) return '';
    const key = type.toLowerCase().trim();

    if (/early in/i.test(key)) return 'Early In';
    if (/late in/i.test(key)) return 'Late In';
    if (/early out/i.test(key)) return 'Early Out';
    if (/late out/i.test(key)) return 'Late Out';
    if (/absent/i.test(key)) return 'Absent';
    if (/short leave/i.test(key)) return 'Short Leave';
    if (/half day/i.test(key)) return 'Half Day';
    if (/^leave$/i.test(key) || (/leave/i.test(key) && !/short|half/i.test(key))) return 'Leave';
    if (/weekend/i.test(key)) return 'Weekend';
    if (/holiday/i.test(key)) return 'Holiday';

    return type.trim();
  }
}
