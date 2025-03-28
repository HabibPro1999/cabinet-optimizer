
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { ArrowLeft, Menu /* other icons */ } from "lucide-react";
// Add a new prop to accept a back navigation function
interface DashboardLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean; // New prop
  onBack?: () => void;
}

export function DashboardLayout({
  children,
  showBackButton = false,
  onBack
}: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update date every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleLogoutConfirm = async () => {
    try {
      await auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar showMenuButton={!showBackButton} />
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirmation de déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Déconnecter"
        cancelText="Annuler"
      />

      <main
        className={cn(
          "flex-1 w-full transition-all duration-300 min-h-screen",
          "ml-0 lg:ml-64"
        )}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background/90 backdrop-blur-sm sticky top-0 z-10">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onBack ? onBack() : navigate(-1)}
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-5"></div> // Empty div to maintain spacing
          )}

          <div className={cn("flex items-center gap-2", isMobile && "ml-auto")}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Changer le thème"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
