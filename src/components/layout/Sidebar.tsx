import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
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
    href: "/dashboard",
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

interface SidebarProps {
  showMenuButton?: boolean;
}

export function Sidebar({ showMenuButton = true }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Reset mobile drawer state on route change and initial load
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  // Memoize filtered links to reduce re-renders
  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.includes(currentUser.role)
  );

  return (
    <>
      {isMobile && showMenuButton && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Overlay - only render when needed */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar transition-transform duration-200 ease-in-out",
          isMobile
            ? cn(
              "w-64 transform",
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )
            : cn(
              "w-64 transform",
              "-translate-x-full lg:translate-x-0"
            ),
          "border-r border-sidebar-border"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white whitespace-nowrap">Mon cabinet</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3">
            <ul className="space-y-1.5">
              {filteredLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white/80 hover:text-white hover:bg-sidebar-accent whitespace-nowrap",
                      location.pathname === link.href && "bg-sidebar-accent text-white"
                    )}
                    onClick={() => isMobile && setIsMobileOpen(false)}
                  >
                    <link.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{link.label}</span>
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
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate whitespace-nowrap">Dr. Martin Dupont</p>
                <p className="text-xs text-white/70 truncate whitespace-nowrap">Médecin Principal</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
