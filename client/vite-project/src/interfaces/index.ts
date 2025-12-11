export interface Iuser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "owner";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUsersStore {
  user: Iuser | null;
  setUser: (user: Iuser) => void;
}
export interface ISalon {
  _id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  minimumServiceCharge: number;
  maximumServiceCharge: number;
  offerStatus: "active" | "inactive";
  workingDays: string[];
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  slotDuration: number;
  maxBookingPerSlot: number;
  locationInMap?: object;
  owner?: Iuser;
  isActive?:boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBooking {
  _id: string;
  user: Iuser | string;
  salon: ISalon | string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
