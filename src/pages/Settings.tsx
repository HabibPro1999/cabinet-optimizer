
import { useState } from "react";
import {
  Users,
  ShieldCheck,
  Settings as SettingsIcon,
  UserPlus,
  Edit,
  Trash,
  Check,
  X,
  AlertCircle,
  Sun,
  Moon
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/ThemeContext";

// Mock data for demonstration
const MOCK_USERS = [
  {
    id: "u1",
    name: "Dr. Martin Dupont",
    email: "martin.dupont@cabinet.fr",
    role: "admin" as UserRole,
  },
  {
    id: "u2",
    name: "Dr. Sophie Moreau",
    email: "sophie.moreau@cabinet.fr",
    role: "doctor" as UserRole,
  },
  {
    id: "u3",
    name: "Dr. Thomas Laurent",
    email: "thomas.laurent@cabinet.fr",
    role: "doctor" as UserRole,
  },
  {
    id: "u4",
    name: "Marie Petit",
    email: "marie.petit@cabinet.fr",
    role: "assistant" as UserRole,
  },
];

interface NewUserForm {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

const Settings = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [activeTab, setActiveTab] = useState<"users" | "permissions" | "general">("users");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "doctor",
    password: "",
  });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<NewUserForm, 'password'>>({
    name: "",
    email: "",
    role: "doctor",
  });
  const { theme, toggleTheme } = useTheme();

  // Handle adding a new user
  const handleAddUser = () => {
    if (showAddUserForm) {
      if (newUser.name && newUser.email && newUser.password) {
        // Add new user
        setUsers([
          ...users,
          {
            id: `u${users.length + 1}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        ]);

        // Reset form and hide it
        setNewUser({
          name: "",
          email: "",
          role: "doctor",
          password: "",
        });
        setShowAddUserForm(false);

        toast.success("Utilisateur ajouté avec succès");
      } else {
        toast.error("Veuillez remplir tous les champs obligatoires");
      }
    } else {
      setShowAddUserForm(true);
    }
  };

  // Handle editing a user
  const handleEditUser = (userId: string) => {
    if (editingUser === userId) {
      // Save changes
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, name: editForm.name, email: editForm.email, role: editForm.role }
            : user
        )
      );
      setEditingUser(null);
      toast.success("Utilisateur modifié avec succès");
    } else {
      // Start editing
      const userToEdit = users.find((user) => user.id === userId);
      if (userToEdit) {
        setEditForm({
          name: userToEdit.name,
          email: userToEdit.email,
          role: userToEdit.role,
        });
        setEditingUser(userId);
      }
    }
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId);
    if (userToDelete?.role === "admin") {
      toast.error("Impossible de supprimer un administrateur");
      return;
    }

    setUsers(users.filter((user) => user.id !== userId));
    toast.success("Utilisateur supprimé avec succès");
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Render role badge
  const RoleBadge = ({ role }: { role: UserRole }) => {
    return (
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-medium",
          role === "admin" ? "bg-primary/20 text-primary" :
            role === "doctor" ? "bg-status-confirmed/20 text-status-confirmed" :
              "bg-status-pending/20 text-status-pending"
        )}
      >
        {role === "admin" ? "Admin" : role === "doctor" ? "Médecin" : "Assistant"}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs et les préférences du cabinet
        </p>
      </div>

      <div className="glass-card animate-in overflow-hidden">
        <div className="border-b border-border">
          <nav className="flex">
            <button
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === "users"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 inline-block mr-2" />
              Utilisateurs
            </button>
            <button
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === "permissions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("permissions")}
            >
              <ShieldCheck className="h-4 w-4 inline-block mr-2" />
              Permissions
            </button>
            <button
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === "general"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("general")}
            >
              <SettingsIcon className="h-4 w-4 inline-block mr-2" />
              Général
            </button>
          </nav>
        </div>

        {activeTab === "users" && (
          <div>
            <div className="p-4 flex items-center justify-between border-b border-border">
              <h2 className="font-medium">Liste des utilisateurs</h2>
              <Button size="sm" className="gap-1" onClick={handleAddUser}>
                <UserPlus className="h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </div>

            {showAddUserForm && (
              <div className="p-4 bg-secondary/30 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Ajouter un nouvel utilisateur</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddUserForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom complet*</label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email*</label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mot de passe*</label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rôle*</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                      className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="admin">Administrateur</option>
                      <option value="doctor">Médecin</option>
                      <option value="assistant">Assistant</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddUserForm(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser}>
                    Ajouter l'utilisateur
                  </Button>
                </div>
              </div>
            )}

            <div className="divide-y divide-border">
              {users.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  {editingUser === user.id ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                          disabled={user.role === "admin"}
                        >
                          <option value="admin">Administrateur</option>
                          <option value="doctor">Médecin</option>
                          <option value="assistant">Assistant</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Check className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <RoleBadge role={user.role} />
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === "admin"}
                          >
                            <Trash className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="p-6">
            <h2 className="font-medium mb-4">Permissions des utilisateurs</h2>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Rôle</th>
                    <th className="py-3 px-4 text-center font-medium text-muted-foreground">Gestion des patients</th>
                    <th className="py-3 px-4 text-center font-medium text-muted-foreground">Calendrier personnel</th>
                    <th className="py-3 px-4 text-center font-medium text-muted-foreground">Calendriers autres médecins</th>
                    <th className="py-3 px-4 text-center font-medium text-muted-foreground">Notes & mémos vocaux</th>
                    <th className="py-3 px-4 text-center font-medium text-muted-foreground">Analyses & rapports</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3 px-4 font-medium">Admin</td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Médecin</td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center">Conditionnel</td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center">Partiel</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Assistant</td>
                    <td className="py-3 px-4 text-center"><Check className="h-5 w-5 text-status-done mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-5 w-5 text-status-canceled mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-5 w-5 text-status-canceled mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-5 w-5 text-status-canceled mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-5 w-5 text-status-canceled mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center gap-2 p-4 rounded-lg bg-status-pending/10 border border-status-pending/20 text-sm">
              <AlertCircle className="h-5 w-5 text-status-pending flex-shrink-0" />
              <p>Seul l'administrateur peut modifier les permissions des utilisateurs. Les médecins peuvent avoir accès aux calendriers d'autres médecins si l'administrateur l'autorise.</p>
            </div>
          </div>
        )}

        {activeTab === "general" && (
          <div className="p-6">
            <h2 className="font-medium mb-6">Paramètres généraux</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Nom du cabinet</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md border border-input px-3 py-2"
                    defaultValue="Cabinet Médical"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-md border border-input px-3 py-2"
                    defaultValue="contact@cabinet-medical.fr"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <input
                    type="tel"
                    className="mt-1 w-full rounded-md border border-input px-3 py-2"
                    defaultValue="+33 1 23 45 67 89"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Adresse</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md border border-input px-3 py-2"
                    defaultValue="123 Rue Médicale, 75001 Paris"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Horaires d'ouverture</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm mb-1">Lundi - Vendredi</p>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input px-3 py-2"
                      defaultValue="08:00 - 19:00"
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Samedi</p>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input px-3 py-2"
                      defaultValue="09:00 - 12:00"
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Dimanche</p>
                    <input
                      type="text"
                      className="w-full rounded-md border border-input px-3 py-2"
                      defaultValue="Fermé"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Thème</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => {
                      if (theme !== "light") toggleTheme();
                    }}
                  >
                    <Sun className="h-5 w-5" />
                    Clair
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => {
                      if (theme !== "dark") toggleTheme();
                    }}
                  >
                    <Moon className="h-5 w-5" />
                    Sombre
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center mt-8">
                <Button className="px-6">
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
