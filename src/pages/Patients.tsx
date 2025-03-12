
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  UserPlus, 
  FileText, 
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  X
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

interface NewPatientForm {
  fullName: string;
  parentName: string;
  parentPhone: string;
  condition: string;
}

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState<NewPatientForm>({
    fullName: "",
    parentName: "",
    parentPhone: "",
    condition: "",
  });
  const navigate = useNavigate();

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new patient
  const handleAddPatient = () => {
    if (showAddForm) {
      if (newPatient.fullName && newPatient.parentName && newPatient.parentPhone) {
        // Add new patient to the list
        const newId = `p${patients.length + 1}`;
        const createdAt = new Date().toISOString().split('T')[0];
        
        setPatients([
          ...patients,
          {
            id: newId,
            ...newPatient,
            createdAt,
          },
        ]);
        
        // Reset form and hide it
        setNewPatient({
          fullName: "",
          parentName: "",
          parentPhone: "",
          condition: "",
        });
        setShowAddForm(false);
        
        toast.success("Patient ajouté avec succès");
      } else {
        toast.error("Veuillez remplir tous les champs obligatoires");
      }
    } else {
      setShowAddForm(true);
    }
  };

  // Handle viewing a patient's details
  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
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

        {showAddForm && (
          <div className="p-4 bg-secondary/30 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Ajouter un nouveau patient</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nom complet*</label>
                <Input
                  value={newPatient.fullName}
                  onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom du parent*</label>
                <Input
                  value={newPatient.parentName}
                  onChange={(e) => setNewPatient({ ...newPatient, parentName: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone du parent*</label>
                <Input
                  value={newPatient.parentPhone}
                  onChange={(e) => setNewPatient({ ...newPatient, parentPhone: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Condition médicale</label>
                <Input
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddPatient}>
                Ajouter le patient
              </Button>
            </div>
          </div>
        )}

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
