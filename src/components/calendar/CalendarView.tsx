
import { useState, useMemo } from "react";
import {
  format,
  addDays,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameDay,
  addWeeks,
  subWeeks,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  parse,
  isWithinInterval
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Clock,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface CalendarViewProps {
  appointments: Appointment[];
  onDateClick?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onAddAppointment?: (date: Date, hour?: number) => void;
}

const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => i + 8); // 8AM to 17PM

export function CalendarView({
  appointments,
  onDateClick,
  onAppointmentClick,
  onAddAppointment
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { role } = useAuth(); // Access the user's role

  // Calculate the days of the current week
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end });
  }, [currentWeek]);

  // Navigation functions
  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => {
    setCurrentWeek(new Date());
    setSelectedDate(new Date());
  };

  // Helper function to convert time string to date object
  const timeToDate = (date: string, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = new Date(date);
    return setMinutes(setHours(dateObj, hours), minutes);
  };

  // Filter appointments for each day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => {
      return isSameDay(new Date(apt.date), day);
    });
  };

  // Status colors for appointments
  const statusColors: Record<AppointmentStatus, string> = {
    pending: "bg-status-pending/20 border-status-pending text-status-pending",
    confirmed: "bg-status-confirmed/20 border-status-confirmed text-status-confirmed",
    canceled: "bg-status-canceled/20 border-status-canceled text-status-canceled",
    done: "bg-status-done/20 border-status-done text-status-done",
  };

  // Calculate appointment position and height
  const calculateAppointmentStyle = (appointment: Appointment) => {
    const startTime = timeToDate(appointment.date, appointment.time);
    const startHour = getHours(startTime) + getMinutes(startTime) / 60;
    const duration = appointment.duration || 30; // Default to 30 minutes if not specified
    const height = (duration / 60) * 100; // 100px per hour

    // Calculate top position (relative to 8 AM)
    const topPosition = (startHour - 8) * 100;

    return {
      top: `${topPosition}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="glass-card animate-in overflow-hidden rounded-xl shadow-sm border border-border">
      <div className="p-5 flex items-center justify-between border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="font-medium shadow-sm"
          >
            Aujourd'hui
          </Button>

          <div className="flex items-center bg-background rounded-lg shadow-sm border border-border">
            <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="rounded-r-none">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium px-3">
              {format(weekDays[0], "MMMM yyyy", { locale: fr })}
            </h2>
            <Button variant="ghost" size="icon" onClick={goToNextWeek} className="rounded-l-none">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {role === "assistant" && (
          <Button
            size="sm"
            onClick={() => onAddAppointment?.(selectedDate)}
            className="gap-1 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        )}
      </div>

      <div className="flex overflow-hidden h-[700px]"> {/* Reduced height */}
        {/* Time labels */}
        <div className="w-20 flex-shrink-0 border-r border-border bg-muted/20">
          <div className="h-[72px]" /> {/* Spacer for header alignment */}
          {TIME_SLOTS.map((hour) => (
            <div key={hour} className="h-[70px] -mt-3 pr-4 text-right"> {/* Reduced slot height */}
              <span className="text-xs font-medium text-muted-foreground">{hour}:00</span>
            </div>
          ))}
        </div>

        {/* Days of the week */}
        <div className="flex-1 overflow-auto">
          <div className="flex divide-x divide-border">
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className="flex-1 min-w-[150px]"
              >
                <button
                  className={cn(
                    "w-full h-[72px] text-center cursor-pointer transition-colors", // Fixed height for header
                    isSameDay(day, selectedDate) ? "bg-primary/10" : "hover:bg-secondary",
                    isToday(day) && "font-semibold"
                  )}
                  onClick={() => {
                    setSelectedDate(day);
                    onDateClick?.(day);
                  }}
                >
                  <div className="text-xs text-muted-foreground mb-1 font-medium">
                    {format(day, "EEEE", { locale: fr })}
                  </div>
                  <div className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center mx-auto transition-colors",
                    isToday(day) && "bg-primary text-primary-foreground shadow-md",
                    isSameDay(day, selectedDate) && !isToday(day) && "bg-secondary shadow-sm"
                  )}>
                    {format(day, "d", { locale: fr })}
                  </div>
                </button>

                {/* Appointments for this day */}
                <div className="relative h-[630px] border-t border-border"> {/* Adjusted height */}
                  {/* Hour grid lines */}
                  {TIME_SLOTS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute w-full h-px bg-border"
                      style={{ top: `${(hour - 8) * 70}px` }}
                    />
                  ))}

                  {/* Show appointments */}
                  {getAppointmentsForDay(day).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={cn(
                        "absolute left-1 right-1 p-2 rounded-md border overflow-hidden",
                        "transition-all hover:scale-[1.02] hover:shadow-md hover:z-10 cursor-pointer",
                        statusColors[appointment.status]
                      )}
                      style={calculateAppointmentStyle(appointment)}
                      onClick={() => onAppointmentClick?.(appointment)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="text-xs font-medium truncate">{appointment.patientName}</div>
                        <div className="text-xs flex items-center gap-1 opacity-80">
                          <Clock className="h-3 w-3" />
                          {format(parse(appointment.time, 'HH:mm', new Date()), 'HH:mm')}
                        </div>
                        {appointment.duration > 30 && (
                          <div className="text-xs flex items-center gap-1 mt-auto opacity-80">
                            <User className="h-3 w-3" />
                            <span className="truncate">Dr. {appointment.doctorName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
