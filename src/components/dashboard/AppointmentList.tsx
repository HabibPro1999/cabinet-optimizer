
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types";

export interface AppointmentListProps {
  appointments: Appointment[];
  title?: string;
  limit?: number;
  className?: string;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function AppointmentList({
  appointments,
  title,
  limit = 5,
  className,
  onAppointmentClick
}: AppointmentListProps) {
  const displayAppointments = appointments.slice(0, limit);

  const getStatusLabel = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmé";
      case "done":
        return "Terminé";
      case "canceled":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <div className={cn("border-t border-border", className)}>
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}

      {displayAppointments.length > 0 ? (
        <div className="divide-y divide-border">
          {displayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => onAppointmentClick?.(appointment)}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{appointment.patientName}</p>
                <span
                  className={cn(
                    "status-badge",
                    `status-badge-${appointment.status}`
                  )}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  {format(new Date(`${appointment.date}T${appointment.time}`), "HH:mm")} (
                  {appointment.duration} min)
                </p>
                <p>Dr. {appointment.doctorName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Aucun rendez-vous
        </div>
      )}
    </div>
  );
}
