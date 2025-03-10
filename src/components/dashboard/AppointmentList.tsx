
import { useState } from "react";
import { Link } from "react-router-dom";
import { format, isPast, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CalendarClock, 
  ChevronRight, 
  Search, 
  XCircle, 
  Clock, 
  CalendarCheck, 
  CalendarX, 
  CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Appointment, AppointmentStatus } from "@/types";

interface AppointmentListProps {
  appointments: Appointment[];
  title?: string;
  limit?: number;
  interactive?: boolean;
  className?: string;
}

export function AppointmentList({
  appointments,
  title = "Rendez-vous à venir",
  limit = 5,
  interactive = true,
  className
}: AppointmentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredAppointments = appointments
    .filter(appointment => 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, limit);

  const statusIcons = {
    pending: CalendarClock,
    confirmed: CalendarCheck,
    canceled: CalendarX,
    done: CheckCircle2
  };

  const statusColors = {
    pending: "text-status-pending",
    confirmed: "text-status-confirmed",
    canceled: "text-status-canceled",
    done: "text-status-done"
  };

  return (
    <div className={cn("glass-card", className)}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-medium">{title}</h2>
        
        {interactive && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 w-[200px] h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <div className="divide-y divide-border">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const StatusIcon = statusIcons[appointment.status];
            const statusColor = statusColors[appointment.status];
            const isPastAppointment = isPast(new Date(`${appointment.date}T${appointment.time}`)) && !isToday(new Date(appointment.date));
            
            return (
              <div
                key={appointment.id}
                className={cn(
                  "p-4 pl-6 flex items-center gap-4 transition-colors",
                  interactive && "hover:bg-accent/50 cursor-pointer"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", 
                  `bg-${appointment.status === 'pending' ? 'status-pending' : appointment.status === 'confirmed' ? 'status-confirmed' : appointment.status === 'done' ? 'status-done' : 'status-canceled'}/10`)}>
                  <StatusIcon className={cn("h-5 w-5", statusColor)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{appointment.patientName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(`${appointment.date}T${appointment.time}`), "HH'h'mm", { locale: fr })}
                    </span>
                    <span>•</span>
                    <span>Dr. {appointment.doctorName}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "status-badge",
                    `status-badge-${appointment.status}`
                  )}>
                    {appointment.status === 'pending' ? 'En attente' :
                     appointment.status === 'confirmed' ? 'Confirmé' :
                     appointment.status === 'done' ? 'Terminé' : 'Annulé'}
                  </div>
                  
                  {interactive && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <XCircle className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Aucun rendez-vous trouvé
            </p>
          </div>
        )}
      </div>
      
      {interactive && appointments.length > limit && (
        <div className="p-4 border-t border-border text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/appointments">
              Voir tous les rendez-vous
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
