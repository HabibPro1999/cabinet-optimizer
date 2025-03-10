
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

interface CalendarViewProps {
  appointments: Appointment[];
  onDateClick?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onAddAppointment?: (date: Date, hour?: number) => void;
}

const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM to 7PM

export function CalendarView({
  appointments,
  onDateClick,
  onAppointmentClick,
  onAddAppointment
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());

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
    <div className="glass-card animate-in overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Aujourd'hui
          </Button>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium px-2">
              {format(weekDays[0], "MMMM yyyy", { locale: fr })}
            </h2>
            <Button variant="ghost" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={() => onAddAppointment?.(selectedDate)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>
      
      <div className="flex overflow-hidden h-[800px]">
        {/* Time labels */}
        <div className="w-16 flex-shrink-0 border-r border-border pt-10">
          {TIME_SLOTS.map((hour) => (
            <div key={hour} className="h-[100px] -mt-3 pr-2 text-right">
              <span className="text-xs text-muted-foreground">{hour}:00</span>
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
                    "w-full py-2 text-center cursor-pointer transition-colors",
                    isSameDay(day, selectedDate) ? "bg-primary/10" : "hover:bg-secondary",
                    isToday(day) && "font-semibold"
                  )}
                  onClick={() => {
                    setSelectedDate(day);
                    onDateClick?.(day);
                  }}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {format(day, "EEEE", { locale: fr })}
                  </div>
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mx-auto",
                    isToday(day) && "bg-primary text-primary-foreground",
                    isSameDay(day, selectedDate) && !isToday(day) && "bg-secondary"
                  )}>
                    {format(day, "d", { locale: fr })}
                  </div>
                </button>
                
                {/* Appointments for this day */}
                <div className="relative h-[700px] border-t border-border">
                  {/* Hour grid lines */}
                  {TIME_SLOTS.map((hour) => (
                    <div 
                      key={hour} 
                      className="absolute w-full h-px bg-border"
                      style={{ top: `${(hour - 8) * 100}px` }}
                    />
                  ))}
                  
                  {/* Show appointments */}
                  {getAppointmentsForDay(day).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={cn(
                        "absolute left-1 right-1 p-2 rounded border overflow-hidden",
                        "transition-transform hover:scale-[1.02] hover:z-10 cursor-pointer",
                        statusColors[appointment.status]
                      )}
                      style={calculateAppointmentStyle(appointment)}
                      onClick={() => onAppointmentClick?.(appointment)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="text-xs font-medium truncate">{appointment.patientName}</div>
                        <div className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(parse(appointment.time, 'HH:mm', new Date()), 'HH:mm')}
                        </div>
                        {appointment.duration > 30 && (
                          <div className="text-xs flex items-center gap-1 mt-auto">
                            <User className="h-3 w-3" />
                            <span className="truncate">Dr. {appointment.doctorName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add appointment button on empty cells */}
                  {TIME_SLOTS.map((hour) => (
                    <button
                      key={hour}
                      className="absolute w-full h-[100px] opacity-0 hover:opacity-100 flex items-center justify-center"
                      style={{ top: `${(hour - 8) * 100}px` }}
                      onClick={() => onAddAppointment?.(day, hour)}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Plus className="h-3 w-3 text-primary" />
                      </div>
                    </button>
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
