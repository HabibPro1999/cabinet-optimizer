
import { useState } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Search, 
  CalendarPlus,
  ListFilter
} from "lucide-react";
import { format, addDays, subDays, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Appointment, AppointmentStatus } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const DOCTORS = [
  { id: "d1", name: "Dr. Dupont" },
  { id: "d2", name: "Dr. Moreau" },
  { id: "d3", name: "Dr. Laurent" },
];

const STATUSES: AppointmentStatus[] = ["pending", "confirmed", "done", "canceled"];

type ViewMode = "calendar" | "list";

const Appointments = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | null>(null);

  // Filter appointments based on search query, date, doctor, and status
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by date (only for list view)
    const matchesDate = viewMode === "calendar" ? true : appointment.date === format(selectedDate, "yyyy-MM-dd");
    
    // Filter by doctor
    const matchesDoctor = selectedDoctor === null || appointment.doctorId === selectedDoctor;
    
    // Filter by status
    const matchesStatus = selectedStatus === null || appointment.status === selectedStatus;
    
    return matchesSearch && matchesDate && matchesDoctor && matchesStatus;
  });

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    toast.info(`Rendez-vous sélectionné: ${appointment.patientName}`);
  };

  // Handle adding a new appointment
  const handleAddAppointment = (date: Date, hour?: number) => {
    const timeString = hour ? `${hour}:00` : "09:00";
    toast.info(`Nouveau rendez-vous: ${date.toLocaleDateString('fr-FR')} à ${timeString}`);
  };

  // Date navigation functions
  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Rendez-vous</h1>
        <p className="text-muted-foreground">
          Gérez vos rendez-vous et votre planning
        </p>
      </div>

      <div className="glass-card mb-8 animate-in">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un rendez-vous..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center rounded-md bg-secondary p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 gap-1",
                  viewMode === "calendar" && "bg-background shadow-sm"
                )}
                onClick={() => setViewMode("calendar")}
              >
                <Calendar className="h-4 w-4" />
                Calendrier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 gap-1",
                  viewMode === "list" && "bg-background shadow-sm"
                )}
                onClick={() => setViewMode("list")}
              >
                <ListFilter className="h-4 w-4" />
                Liste
              </Button>
            </div>

            <Button
              size="sm"
              className="gap-1"
              onClick={() => handleAddAppointment(selectedDate)}
            >
              <CalendarPlus className="h-4 w-4" />
              Nouveau
            </Button>
          </div>
        </div>

        {viewMode === "list" && (
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={isToday(selectedDate) ? "default" : "outline"}
                size="sm"
                onClick={goToToday}
              >
                Aujourd'hui
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                className="h-9 px-3 py-2 rounded-md border border-input bg-background text-sm"
                value={selectedDoctor || ""}
                onChange={(e) => setSelectedDoctor(e.target.value || null)}
              >
                <option value="">Tous les médecins</option>
                {DOCTORS.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>

              <select
                className="h-9 px-3 py-2 rounded-md border border-input bg-background text-sm"
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value as AppointmentStatus || null)}
              >
                <option value="">Tous les statuts</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === "pending"
                      ? "En attente"
                      : status === "confirmed"
                      ? "Confirmé"
                      : status === "done"
                      ? "Terminé"
                      : "Annulé"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {viewMode === "calendar" ? (
          <CalendarView
            appointments={filteredAppointments}
            onAppointmentClick={handleAppointmentClick}
            onAddAppointment={handleAddAppointment}
          />
        ) : (
          <AppointmentList
            appointments={filteredAppointments}
            title={format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
            limit={20}
            className="border-none"
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
