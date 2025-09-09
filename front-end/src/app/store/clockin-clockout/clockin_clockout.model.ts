export interface clockinclockout {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  calling_name?: string | null;
  employee_code?: string;
  contact_no?: string;
  address?: string;
  country?: string;
  department?: string;
  designation?: string;
  profile_image?: string;
}

export interface load_profile {
  id: number;
  first_name: string;
  last_name: string;
  department?: string;
  designation?: string;
  profile_image?: string;
  gender?:number;
  date_of_birth?:string;
}
// export interface load_clockinout_details {
//   length: boolean;
//   id: number;
//   action_type: string;
//   action_time: string;
// }

export interface AttendanceStatusEntry {
    type: string;
    action_type: string;
    timestamp: string; 
    date: string;
    shift_id: number;
}


export type load_attandance_ststaus = AttendanceStatusEntry[];


export interface ClockInOutRecord {
  id: number;
  action_type: 'clock_in' | 'clock_out';
  action_time: string;
}

export interface ClockallInOutRecord {
  id: number;
  action_type: 'clock_in' | 'clock_out';
  action_time: string;
}

export type load_clockinout_details = ClockInOutRecord[];

export type load_all_in_and_out_data =  ClockallInOutRecord[];


export interface load_clockinoutprfile {
  success: boolean;
  data: load_profile;
  message: string;
}

export interface ClockinoutState {
  clockinclockout: clockinclockout | null;
  loadprofiledata: load_profile | null;
  loadattandacestatus: load_attandance_ststaus | null;
  loadallinandoutdata: load_all_in_and_out_data | null;
  clockinoutDetails: load_clockinout_details | null; 
  otherCelebrantsMessage: string | null;
  userMessage: string | null;
  isLoading: boolean;
  error: any;
  wishesLoading: boolean;
  wishesError: any | null;
}

export interface clockinrespons {
  success: boolean;
  message: string;
}

export interface clockoutrespons {
  success: boolean;
  message: string;
}

