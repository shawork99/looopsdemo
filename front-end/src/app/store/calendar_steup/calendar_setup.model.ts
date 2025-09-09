export type EventType = 'holiday' | 'event';

export interface CalendarSetup {
    id: number;
    title: string;
    date: string;
    event_type: EventType;
}

export interface CalendarSetupEvent {
    id: string;
    textClass: string;
    className: string;
    start: Date;
    title: string;
}

export interface GetAllCalendarSetupResponse {
    success: boolean;
    message: string;
    data: CalendarSetupEvent[];
}

export interface CreateCalendarSetupResponse {
    message: string;
    success: boolean;
}

export interface UpdateCalendarSetupResponse {
    message: string;
    success: boolean;
}

export interface DeleteCalendarSetupResponse {
    message: string;
    success: boolean;
}

export interface GetEditCalendarSetupResponse {
    message: string;
    data: CalendarSetup;
    success: boolean;
}
