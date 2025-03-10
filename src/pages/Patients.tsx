
import { useState } from "react";
import { 
  Plus, 
  Search, 
  UserPlus, 
  FileText, 
  MoreHorizontal,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock data for demonstration
const MOCK_PATIENTS = [
  {
    id: "p1",
    fullName: "Sophie Martin",
    parentName: "Jean Martin",
    parentPhone: "+33 6 12 34 56 78",
    condition: "Allergie saisonnière",
    createdAt: "2023-01-15",
  },
  {
    id: "p2",
    fullName: "Thomas Bernard",
    parentName: "Marie Bernard",
    parentPhone: "+33 6 23 45 67 89",
    condition: "Asthme",
    createdAt: "2023-02-20",
  },
  {
    id: "p3",
    fullName: "Claire Dubois",
    parentName: "Pierre Dubois",
    parentPhone: "+33 6 34 56 78 90",
    condition: "Eczéma",
    createdAt: "2023-03-10",
  },
  {
    id: "p4",
    fullName: "Antoine Leroy",
    parentName: "Sophie Leroy",
    parentPhone: "+33 6 45 67 89 01",
    condition: "Rhinite",
    createdAt: "2023-04-05",
  },
  {
    id: "p5",
    fullName: "Marie Petit",
    parentName: "Laurent Petit",
    parentPhone: "+33 6 56 78 90 12",
    condition: "Bronchite chronique",
    createdAt: "2023-05-15",
  },
];

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState(MOCK_PATIENTS);

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new patient
  const handleAddPatient = () => {
    toast.info("Formulaire d'ajout de patient ouvert");
  };

  // Handle viewing a patient's details
  const handleViewPatient = (patientId: string) => {
    toast.info(`Affichage des détails du patient: ${patientId}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Patients</h1>
        <p className="text-muted-foreground">
          Gérez les dossiers de vos patients et leurs informations
        </p>
      </div>

      <div className="glass-card mb-8 animate-in">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button size="sm" className="gap-1" onClick={handleAddPatient}>
              <UserPlus className="h-4 w-4" />
              Nouveau patient
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Nom complet
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Parent
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Téléphone
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Condition
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => handleViewPatient(patient.id)}
                  >
                    <td className="py-3 px-4">{patient.fullName}</td>
                    <td className="py-3 px-4">{patient.parentName}</td>
                    <td className="py-3 px-4">{patient.parentPhone}</td>
                    <td className="py-3 px-4">{patient.condition}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Aucun patient trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          Affichage de {filteredPatients.length} sur {patients.length} patients
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
