
import { useEffect, useState } from "react";
import { format, isBefore, addDays, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GreetingBannerProps {
  name: string;
  tomorrow?: {
    firstAppointmentTime: string | null;
  };
}

export function GreetingBanner({ name, tomorrow }: GreetingBannerProps) {
  const [greeting, setGreeting] = useState("");
  const [showTomorrow, setShowTomorrow] = useState(false);
  
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting("Bonjour");
    } else if (hour < 18) {
      setGreeting("Bon après-midi");
    } else {
      setGreeting("Bonsoir");
    }
    
    // Show tomorrow message after 17:00
    setShowTomorrow(hour >= 17 && !!tomorrow?.firstAppointmentTime);
  }, [tomorrow]);

  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      const time = parse(timeString, "HH:mm", new Date());
      return format(time, "HH'h'mm", { locale: fr });
    } catch (error) {
      return timeString;
    }
  };

  return (
    <div className="glass-card p-6 mb-8 overflow-hidden relative animate-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {greeting}, <span className="text-primary">{name}</span>
          </h1>
          
          <p className="text-muted-foreground max-w-md">
            {showTomorrow && tomorrow?.firstAppointmentTime ? (
              <>
                Demain, vous commencez à{" "}
                <span className="font-medium text-foreground">
                  {formatTime(tomorrow.firstAppointmentTime)}
                </span>
              </>
            ) : (
              <>
                {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
              </>
            )}
          </p>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
          "bg-primary/10 text-primary animate-scale-in"
        )}>
          <Sparkles className="h-4 w-4" />
          <span>Bienvenue</span>
        </div>
      </div>
      
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
}
