
export type UserRole = "admin" | "doctor" | "assistant";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "canceled" | "done";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes?: Note[];
}

export interface Note {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  content: string;
  createdAt: string;
  isVoiceMemo?: boolean;
}

export interface Patient {
  id: string;
  fullName: string;
  parentName?: string;
  parentPhone?: string;
  condition?: string;
  createdAt: string;
  notes?: Note[];
}

export interface DoctorStats {
  totalAppointments: number;
  completedAppointments: number;
  estimatedIncome: number;
}

export interface DashboardStats {
  appointmentsToday: number;
  appointmentsUpcoming: number;
  patientsTotal: number;
  patientsNew: number;
}
