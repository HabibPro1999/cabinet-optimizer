
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardList, 
  Home, 
  Settings, 
  Users,
  BarChart3,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type SidebarLink = {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: ("admin" | "doctor" | "assistant")[];
};

const sidebarLinks: SidebarLink[] = [
  {
    icon: Home,
    label: "Tableau de bord",
    href: "/",
    roles: ["admin", "doctor", "assistant"],
  },
  {
    icon: CalendarDays,
    label: "Rendez-vous",
    href: "/appointments",
    roles: ["admin", "doctor", "assistant"],
  },
  {
    icon: Users,
    label: "Patients",
    href: "/patients",
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

// Mock user for demonstration
const currentUser = {
  role: "admin" as const,
};

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const showSidebar = isMobile ? isMobileOpen : !isCollapsed;

  return (
    <>
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

      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isMobile && isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar transition-all duration-300 ease-in-out",
          isMobile
            ? cn(
                "w-64 transform",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                showSidebar ? "w-64" : "w-20",
                "border-r border-sidebar-border"
              )
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6">
            <div className={cn("flex items-center gap-3", !showSidebar && "justify-center w-full")}>
              <div className="flex items-center justify-center rounded-lg bg-primary w-8 h-8 text-white font-bold">
                C
              </div>
              {showSidebar && <span className="font-semibold text-white">Cabinet Médical</span>}
            </div>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-sidebar-accent"
                onClick={toggleSidebar}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3">
            <ul className="space-y-1.5">
              {sidebarLinks
                .filter((link) => link.roles.includes(currentUser.role))
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white/80 hover:text-white hover:bg-sidebar-accent",
                        location.pathname === link.href && "bg-sidebar-accent text-white",
                        !showSidebar && "justify-center",
                      )}
                    >
                      <link.icon className="h-5 w-5 flex-shrink-0" />
                      {showSidebar && <span>{link.label}</span>}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                D
              </div>
              {showSidebar && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">Dr. Martin Dupont</p>
                  <p className="text-xs text-white/70 truncate">Médecin Principal</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
