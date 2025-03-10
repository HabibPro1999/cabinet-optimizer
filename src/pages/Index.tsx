
import { useState, useEffect } from "react";
import { 
  CalendarDays, 
  UserRound, 
  ClipboardCheck, 
  Coins 
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GreetingBanner } from "@/components/dashboard/GreetingBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Appointment, DashboardStats } from "@/types";
import { toast } from "sonner";

// Mock data for demonstration
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "Sophie Martin",
    doctorId: "d1",
    doctorName: "Dupont",
    date: "2023-10-30",
    time: "09:00",
    duration: 30,
    status: "confirmed",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Thomas Bernard",
    doctorId: "d1",
    doctorName: "Dupont",
    date: "2023-10-30",
    time: "10:00",
    duration: 45,
    status: "pending",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Claire Dubois",
    doctorId: "d2",
    doctorName: "Moreau",
    date: "2023-10-30",
    time: "14:30",
    duration: 30,
    status: "done",
  },
  {
    id: "4",
    patientId: "p4",
    patientName: "Antoine Leroy",
    doctorId: "d1",
    doctorName: "Dupont",
    date: "2023-10-31",
    time: "11:15",
    duration: 30,
    status: "confirmed",
  },
  {
    id: "5",
    patientId: "p5",
    patientName: "Marie Petit",
    doctorId: "d3",
    doctorName: "Laurent",
    date: "2023-10-31",
    time: "16:00",
    duration: 60,
    status: "canceled",
  },
];

const MOCK_STATS: DashboardStats = {
  appointmentsToday: 8,
  appointmentsUpcoming: 27,
  patientsTotal: 485,
  patientsNew: 12,
};

const Index = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      // This would be a real API call in production
      setAppointments(MOCK_APPOINTMENTS);
      setStats(MOCK_STATS);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle clicking on an appointment
  const handleAppointmentClick = (appointment: Appointment) => {
    toast.info(`Rendez-vous sélectionné: ${appointment.patientName}`);
  };

  // Handle adding a new appointment
  const handleAddAppointment = (date: Date, hour?: number) => {
    const timeString = hour ? `${hour}:00` : "09:00";
    toast.info(`Nouveau rendez-vous: ${date.toLocaleDateString('fr-FR')} à ${timeString}`);
  };

  return (
    <DashboardLayout>
      <GreetingBanner 
        name="Dr. Dupont" 
        tomorrow={{
          firstAppointmentTime: "09:00"
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Rendez-vous aujourd'hui"
          value={stats.appointmentsToday}
          icon={CalendarDays}
          trend={{ value: 10, isPositive: true }}
        />
        <StatsCard
          title="Rendez-vous à venir"
          value={stats.appointmentsUpcoming}
          icon={ClipboardCheck}
        />
        <StatsCard
          title="Patients totaux"
          value={stats.patientsTotal}
          icon={UserRound}
        />
        <StatsCard
          title="Nouveaux patients"
          value={stats.patientsNew}
          icon={Coins}
          trend={{ value: 15, isPositive: true }}
          description="Ce mois-ci"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CalendarView 
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
            onAddAppointment={handleAddAppointment}
          />
        </div>
        
        <div>
          <AppointmentList 
            appointments={appointments}
            title="Prochains rendez-vous"
            onAppointmentClick={handleAppointmentClick}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
