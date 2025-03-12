
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Moon, Sun } from "lucide-react"; // Added proper import
import { useTheme } from "@/context/ThemeContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const { theme, toggleTheme } = useTheme();

  // If already authenticated, redirect to dashboard
  if (authLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Connexion réussie!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Échec de la connexion. Vérifiez vos identifiants.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={toggleTheme}
        aria-label="Changer le thème"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4">
        <div className="w-full max-w-md space-y-8 bg-background/60 backdrop-blur-xl p-8 rounded-xl border border-border shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Cabinet Médical</h1>
            <p className="mt-2 text-muted-foreground">Connectez-vous à votre compte</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
