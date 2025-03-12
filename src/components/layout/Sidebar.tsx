
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  Users,
  BarChart3,
  ClipboardList,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

type SidebarLink = {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: ("admin" | "doctor" | "assistant")[];
};

const sidebarLinks: SidebarLink[] = [
  {
    icon: LayoutDashboard,
    label: "Tableau de bord",
    href: "/dashboard",
    roles: ["admin", "doctor", "assistant"],
  },
  {
    icon: Users,
    label: "Patients",
    href: "/patients",
    roles: ["admin", "doctor", "assistant"],
  },
  {
    icon: CalendarDays,
    label: "Rendez-vous",
    href: "/appointments",
    roles: ["admin", "doctor", "assistant"],
  },
  {
    icon: BarChart3,
    label: "Analyses",
    href: "/analytics",
    roles: ["admin", "doctor"],
  },
  {
    icon: ClipboardList,
    label: "Inventaire",
    href: "/inventory",
    roles: ["admin"],
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/settings",
    roles: ["admin"],
  },
];

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();
  
  // Mock user role - in production this would come from user data
  const userRole = "admin" as const;

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isMobile && isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-background border-r border-border transition-all duration-300 ease-in-out",
          isMobile
            ? cn(
              "w-[280px] transform",
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )
            : "w-20 lg:w-[280px]"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-border">
            <div className="font-bold text-xl truncate">
              Cabinet Médical
            </div>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto lg:hidden"
                onClick={toggleSidebar}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {sidebarLinks
                .filter((link) => link.roles.includes(userRole))
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        location.pathname === link.href 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground hover:bg-secondary",
                        isMobile ? "" : "lg:justify-start justify-center"
                      )}
                      onClick={closeSidebar}
                    >
                      <link.icon className="h-5 w-5 flex-shrink-0" />
                      <span className={cn(
                        "truncate",
                        !isMobile && "lg:inline hidden"
                      )}>
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                M
              </div>
              <div className={cn(
                "overflow-hidden",
                !isMobile && "lg:block hidden"
              )}>
                <p className="text-sm font-medium truncate">Marion Dubois</p>
                <p className="text-xs text-muted-foreground truncate">Assistant(e)</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
