
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types";
import { Edit, Trash2 } from "lucide-react";

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

  const getStatusClass = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-500";
      case "confirmed":
        return "bg-green-500/20 text-green-500";
      case "done":
        return "bg-blue-500/20 text-blue-500";
      case "canceled":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  if (displayAppointments.length === 0) {
    return (
      <div className={cn("bg-background/40 backdrop-blur-sm border border-border rounded-lg overflow-hidden", className)}>
        {title && (
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        <div className="p-8 text-center text-muted-foreground">
          Aucun rendez-vous à venir
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-background/40 backdrop-blur-sm border border-border rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}

      <div className="divide-y divide-border">
        {displayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
            onClick={() => onAppointmentClick?.(appointment)}
          >
            <div className="flex items-center justify-between mb-2">
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
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    getStatusClass(appointment.status)
                  )}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-2 gap-2">
              <button className="p-1 rounded hover:bg-secondary transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-secondary transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
