
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    document.documentElement.classList.add("dark");
    
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          isMobile ? "pl-0" : "pl-20 lg:pl-64"
        )}
      >
        <Toaster position="top-right" richColors />
        <div className="container py-6 px-4 md:px-8 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
