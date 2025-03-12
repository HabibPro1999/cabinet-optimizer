
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    <div className="min-h-screen bg-background">
      <Sidebar />
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
          "transition-all duration-300 min-h-screen",
          isMobile ? "pl-0" : "pl-20 lg:pl-64"
        )}
      >
<<<<<<< HEAD
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background/90 backdrop-blur-sm sticky top-0 z-10">
          {!isMobile && (
            <div className="text-sm text-muted-foreground">
              {formatDate(currentDate)}
            </div>
          )}
          {isMobile && <div></div>}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
=======
        <div className="container py-8 pt-2 px-6 md:px-10 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-4 justify-end">
>>>>>>> parent of f4ed7b1 (Update dashboard UI)
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
          {children}
        </div>
      </main>
    </div>
  );
}
