
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface GreetingBannerProps {
  name: string;
  tomorrow?: {
    firstAppointmentTime: string | null;
  };
}

export function GreetingBanner({ name }: GreetingBannerProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold mb-1">
        Bonjour, {name}
      </h1>
      <p className="text-muted-foreground">
        Bienvenue sur votre tableau de bord.
      </p>
    </div>
  );
}
