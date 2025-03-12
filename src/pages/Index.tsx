
import { useState, useEffect } from "react";
import {
  CalendarDays,
  UserRound,
  ClipboardCheck,
  Clock,
  Plus
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GreetingBanner } from "@/components/dashboard/GreetingBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { Button } from "@/components/ui/button";
import { Appointment, DashboardStats } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { format, addDays, isToday } from "date-fns";
import { fr } from "date-fns/locale";

// Mock data for demonstration
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "Lucas Petit",
    doctorId: "d1",
    doctorName: "Pierre Martin",
    date: "2023-03-12",
    time: "16:00",
    duration: 30,
    status: "confirmed",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Thomas Bernard",
    doctorId: "d1",
    doctorName: "Pierre Martin",
    date: "2023-03-13",
    time: "10:00",
    duration: 45,
    status: "pending",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Chloé Lambert",
    doctorId: "d2",
    doctorName: "Sophie Bernard",
    date: "2023-03-11",
    time: "11:30",
    duration: 30,
    status: "confirmed",
  },
  {
    id: "4",
    patientId: "p4",
    patientName: "Léo Moreau",
    doctorId: "d3",
    doctorName: "Emma Leclerc",
    date: "2023-03-11",
    time: "09:00",
    duration: 30,
    status: "pending",
  },
  {
    id: "5",
    patientId: "p5",
    patientName: "Camille Durand",
    doctorId: "d1",
    doctorName: "Pierre Martin",
    date: "2023-03-10",
    time: "14:15",
    duration: 60,
    status: "done",
  },
];

const MOCK_STATS: DashboardStats = {
  appointmentsToday: 2,
  appointmentsUpcoming: 4,
  patientsTotal: 4,
  patientsNew: 12,
};

const Index = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [userName, setUserName] = useState("Marion");
  const { tenantId } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!tenantId) return;

      try {
        // Update the path to include the 'data' subcollection
        const userDoc = doc(db, tenantId, 'users', 'data', auth.currentUser?.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserName(userData.fullName || "Marion");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName("Marion");
      }
    };

    fetchUserName();
  }, [tenantId]);

  // Generate days for the mini calendar
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysArray: Date[] = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(year, month, i));
    }
    
    setDaysInMonth(daysArray);
  }, [currentMonth]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      // This would be a real API call in production
      setAppointments(MOCK_APPOINTMENTS);
      setStats(MOCK_STATS);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Get today's appointments
  const todaysAppointments = appointments.filter(app => {
    const today = format(new Date(), "yyyy-MM-dd");
    return app.date === today;
  });

  // Handle clicking on an appointment
  const handleAppointmentClick = (appointment: Appointment) => {
    toast.info(`Rendez-vous sélectionné: ${appointment.patientName}`);
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format day name
  const formatDayName = (day: number) => {
    const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    return dayNames[day - 1];
  };

  return (
    <DashboardLayout>
      <GreetingBanner name={userName} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Rendez-vous aujourd'hui"
          value={stats.appointmentsToday}
          icon={CalendarDays}
          trend={{ value: 10, isPositive: true }}
        />
        <StatsCard
          title="Patients total"
          value={stats.patientsTotal}
          icon={UserRound}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Revenus estimés"
          value="1250 €"
          icon={Clock}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background/40 backdrop-blur-sm border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Rendez-vous aujourd'hui</h2>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
            
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <p>
                          {format(new Date(`${appointment.date}T${appointment.time}`), "HH:mm")}
                        </p>
                        <span className="mx-2">•</span>
                        <p>Dr. {appointment.doctorName}</p>
                      </div>
                    </div>
                    <div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        appointment.status === "confirmed" ? "bg-green-500/20 text-green-500" :
                        appointment.status === "pending" ? "bg-amber-500/20 text-amber-500" :
                        appointment.status === "done" ? "bg-blue-500/20 text-blue-500" :
                        "bg-red-500/20 text-red-500"
                      )}>
                        {appointment.status === "confirmed" ? "Confirmé" :
                         appointment.status === "pending" ? "En attente" :
                         appointment.status === "done" ? "Terminé" : "Annulé"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun rendez-vous aujourd'hui
              </div>
            )}
          </div>
          
          <AppointmentList
            appointments={appointments.filter(app => {
              const today = format(new Date(), "yyyy-MM-dd");
              return app.date > today;
            })}
            title="Prochains rendez-vous"
            onAppointmentClick={handleAppointmentClick}
          />
        </div>

        <div>
          <div className="bg-background/40 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Calendrier
              </h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={previousMonth}>
                  <span className="sr-only">Mois précédent</span>
                  <span aria-hidden>←</span>
                </Button>
                <span className="text-sm">
                  {format(currentMonth, "MMMM yyyy", { locale: fr })}
                </span>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <span className="sr-only">Mois suivant</span>
                  <span aria-hidden>→</span>
                </Button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className="py-1">
                    {formatDayName(day)}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {daysInMonth.map((day, i) => {
                  const dayAppointments = appointments.filter(a => a.date === format(day, "yyyy-MM-dd"));
                  const isCurrentDay = isToday(day);
                  
                  return (
                    <div key={i} className="relative">
                      <button
                        className={cn(
                          "w-full h-9 rounded-md flex items-center justify-center text-sm",
                          isCurrentDay ? "bg-primary text-primary-foreground" : 
                            dayAppointments.length > 0 ? "bg-secondary" : 
                            "hover:bg-secondary/50"
                        )}
                      >
                        {day.getDate()}
                      </button>
                      
                      {dayAppointments.length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-1">
                          {dayAppointments.slice(0, 3).map((app, idx) => (
                            <div 
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                              title={`${app.time} - ${app.patientName}`}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
