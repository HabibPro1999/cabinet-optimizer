
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

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          isMobile ? "pl-0" : "pl-20 lg:pl-64"
        )}
      >
        <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
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
            onClick={handleLogout}
            aria-label="Déconnexion"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        
        <Toaster position="top-right" richColors />
        <div className="container py-6 px-4 md:px-8 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
