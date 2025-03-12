
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { SparkleContainer } from "@/components/ui/SparkleContainer";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, signIn, isLoading: authLoading } = useAuth();

  // Only redirect if already logged in and auth is not loading
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, navigate, authLoading]);

  // If auth is still loading, show nothing or a loading indicator
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(email, password);

      toast.success("Connexion réussie", {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Firebase auth error:", err.code, err.message);

      // Handle specific error cases
      if (err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-email' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password') {
        toast.error("Email ou mot de passe incorrect", {
          duration: 3000,
          position: "top-center",
        });
      } else if (err.code === 'auth/too-many-requests') {
        toast.error("Trop de tentatives échouées", {
          duration: 3000,
          position: "top-center",
        });
      } else {
        toast.error("Erreur de connexion", {
          duration: 3000,
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Only render the sign-in form if not authenticated and not loading
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Memoized sparkle background */}
      <SparkleContainer theme={theme} />

      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Changer le thème"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-foreground relative z-20">
            Gérez votre cabinet en quelques clics
          </h1>
        </div>

        <div className="glass-card p-8 backdrop-blur-sm bg-card/80 shadow-lg rounded-lg border border-border/30">
          <h1 className="text-2xl font-semibold mb-4 text-center">Connexion</h1>
          <p className="text-muted-foreground text-center mb-6">
            Connectez-vous à votre compte pour continuer
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
