
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Filter, 
  Download,
  Calendar, 
  TrendingUp, 
  Users, 
  CalendarDays
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Sample data for charts
const monthlyData = [
  { name: 'Jan', income: 5000, patients: 40 },
  { name: 'Fév', income: 6000, patients: 45 },
  { name: 'Mar', income: 5500, patients: 43 },
  { name: 'Avr', income: 7000, patients: 50 },
  { name: 'Mai', income: 6500, patients: 47 },
  { name: 'Juin', income: 8000, patients: 55 },
];

const doctorsData = [
  { name: 'Dr. Dupont', income: 12000, patients: 90 },
  { name: 'Dr. Moreau', income: 10000, patients: 75 },
  { name: 'Dr. Laurent', income: 11000, patients: 80 },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState<"finances" | "patients" | "rdv">("finances");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Analyses</h1>
        <p className="text-muted-foreground">
          Visualisez les performances et les tendances de votre cabinet
        </p>
      </div>

      <div className="glass-card animate-in mb-8">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "finances" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("finances")}
              className="gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              Finances
            </Button>
            <Button
              variant={activeTab === "patients" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("patients")}
              className="gap-1"
            >
              <Users className="h-4 w-4" />
              Patients
            </Button>
            <Button
              variant={activeTab === "rdv" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("rdv")}
              className="gap-1"
            >
              <CalendarDays className="h-4 w-4" />
              Rendez-vous
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              Cette année
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "finances" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Revenus mensuels</h3>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                        formatter={(value) => [`${value} €`, 'Revenus']}
                      />
                      <Bar dataKey="income" name="Revenus" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Revenus par médecin</h3>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={doctorsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                        formatter={(value) => [`${value} €`, 'Revenus']}
                      />
                      <Bar dataKey="income" name="Revenus" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Nouveaux patients par mois</h3>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                      />
                      <Line type="monotone" dataKey="patients" stroke="hsl(var(--primary))" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Patients par médecin</h3>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={doctorsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                      />
                      <Bar dataKey="patients" name="Patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rdv" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Rendez-vous par mois</h3>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                      />
                      <Line type="monotone" dataKey="patients" name="Rendez-vous" stroke="hsl(var(--primary))" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
