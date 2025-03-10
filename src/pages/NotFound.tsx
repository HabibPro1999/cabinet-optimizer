
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Page non trouvée
          </p>
          <Button asChild>
            <Link to="/" className="gap-2">
              <Home className="h-4 w-4" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotFound;
