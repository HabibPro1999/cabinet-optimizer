
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SparkleBackground from "@/components/ui/SparkleBackground";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const FormSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center relative">
      <SparkleBackground />
      
      <div className="glass-card w-full max-w-md p-8 z-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Connexion</h1>
          <p className="text-muted-foreground">
            Accédez à votre espace de gestion médicale
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...form.register("email")}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="votre@email.com"
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <Button
                type="button"
                variant="link"
                className="px-0 h-auto text-xs"
                onClick={() => toast.info("Fonctionnalité à venir")}
              >
                Mot de passe oublié?
              </Button>
            </div>
            <input
              id="password"
              type="password"
              {...form.register("password")}
              className="w-full px-3 py-2 border border-input rounded-md"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
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
  );
}
