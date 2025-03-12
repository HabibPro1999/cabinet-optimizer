import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  UserPlus,
  FileText,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  X,
  Trash2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { NewPatientDialog } from "@/components/patients/NewPatientDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { deleteDoc, doc } from "firebase/firestore";

// Add these imports at the top of the file
import { pdf } from '@react-pdf/renderer';
import { PatientPDF } from '@/components/patients/PatientPDF';

interface Patient {
  id: string;
  fullName: string;
  parentName: string;
  parentPhone: string;
  secondaryPhone?: string;
  parentEmail?: string;
  condition: string;
  sex: string;
  hasDocuments?: boolean;
  createdAt: string;
}

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();
  const { tenantId, role } = useAuth(); // Update this line to get userRole
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  // Add sorting state
  const [sortField, setSortField] = useState<keyof Patient>("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Add filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sex: "",
    condition: "",
  });

  // Fetch patients from Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      if (!tenantId) return;

      try {
        setIsLoading(true);
        const patientsRef = collection(db, `${tenantId}/patients/data`);
        const q = query(patientsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const patientsList: Patient[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          patientsList.push({
            id: doc.id,
            fullName: data.fullName || "",
            parentName: data.parentName || "",
            parentPhone: data.parentPhone || "",
            secondaryPhone: data.secondaryPhone || "",
            parentEmail: data.parentEmail || "",
            condition: data.condition || "",
            sex: data.sex || "",
            hasDocuments: data.hasDocuments || false,
            createdAt: data.createdAt || "",
          });
        });

        setPatients(patientsList);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Erreur lors du chargement des patients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [tenantId]);

  // Filter patients based on search query and filters
  const filteredPatients = patients.filter(
    (patient) => {
      const matchesSearch =
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.condition?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSexFilter = !filters.sex || patient.sex === filters.sex;
      const matchesConditionFilter = !filters.condition ||
        patient.condition.toLowerCase().includes(filters.condition.toLowerCase());

      return matchesSearch && matchesSexFilter && matchesConditionFilter;
    }
  );

  // Sort patients based on sort field and direction
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle sort click
  const handleSort = (field: keyof Patient) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle adding a new patient to the local state
  const handlePatientAdded = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
  };

  // Handle viewing a patient's details
  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  // Handle deleting a patient
  const handleDeletePatient = async () => {
    if (!patientToDelete || !tenantId) return;

    try {
      // Delete patient from Firestore
      const patientRef = doc(db, `${tenantId}/patients/data/${patientToDelete}`);
      await deleteDoc(patientRef);

      // Remove patient from local state
      setPatients(patients.filter(patient => patient.id !== patientToDelete));
      toast.success("Patient supprimé avec succès");
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Erreur lors de la suppression du patient");
    } finally {
      setPatientToDelete(null);
    }
  };

  // Add this function after handleDeletePatient and before the return statement
  const handleGeneratePDF = async (patient: Patient) => {
    try {
      // Create a loading toast
      const loadingToast = toast.loading('Génération du PDF en cours...');

      // Generate the PDF
      const blob = await pdf(<PatientPDF patient={patient} />).toBlob();

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `patient-${patient.fullName.replace(/\s+/g, '_')}.pdf`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      // Show success toast and dismiss loading toast
      toast.dismiss(loadingToast);
      toast.success('PDF généré avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-semibold mb-1 md:mb-2">Patients</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Gérez les dossiers de vos patients et leurs informations
        </p>
      </div>

      <div className="glass-card mb-6 md:mb-8 animate-in">
        {/* Improved mobile layout for search and filters */}
        <div className="p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4 border-b border-border">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              className="pl-9 w-full h-9 md:h-10" // Adjusted height for mobile
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 flex-1 md:flex-none h-9 md:h-10 text-xs md:text-sm" // Adjusted height and text size
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              Filtrer
            </Button>
            {/* Only show Add Patient button if user is not a doctor */}
            {role !== "doctor" && (
              <Button
                size="sm"
                className="gap-1 flex-1 md:flex-none h-9 md:h-10 text-xs md:text-sm" // Adjusted height and text size
                onClick={() => setShowAddDialog(true)}
              >
                <UserPlus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Nouveau patient</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter panel - improved for mobile */}
        {showFilters && (
          <div className="p-3 md:p-4 border-b border-border bg-secondary/30">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-start sm:items-end">
              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium mb-1 block">Sexe</label>
                <Select
                  value={filters.sex}
                  onValueChange={(value) => setFilters({ ...filters, sex: value })}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="male">Masculin</SelectItem>
                    <SelectItem value="female">Féminin</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium mb-1 block">Condition</label>
                <Input
                  placeholder="Filtrer par condition"
                  className="w-full sm:w-[200px]"
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto mt-2 sm:mt-0"
                onClick={() => setFilters({ sex: "", condition: "" })}
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            </div>
          </div>
        )}

        {/* Responsive table with card view for mobile - improved spacing */}
        <div className="block md:hidden">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">
              Chargement des patients...
            </div>
          ) : sortedPatients.length > 0 ? (
            <div className="divide-y divide-border">
              {sortedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => handleViewPatient(patient.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{patient.fullName}</h3>
                    <div className="flex">
                      {/* PDF button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7" // Smaller buttons for mobile
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeneratePDF(patient);
                        }}
                      >
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>

                      {/* Only show dropdown menu if user is not a doctor */}
                      {role !== "doctor" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              setPatientToDelete(patient.id);
                            }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <div>
                      <span className="text-muted-foreground">Parent:</span> {patient.parentName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Téléphone:</span> {patient.parentPhone}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sexe:</span> {
                        patient.sex === 'male' ? 'Masculin' :
                          patient.sex === 'female' ? 'Féminin' :
                            patient.sex === 'other' ? 'Autre' : ''
                      }
                    </div>
                    <div>
                      <span className="text-muted-foreground">Condition:</span> {patient.condition}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              Aucun patient trouvé
            </div>
          )}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort("fullName")}
                  >
                    Nom complet
                    <ArrowUpDown className={`h-3 w-3 ${sortField === "fullName" ? "text-foreground" : ""}`} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort("parentName")}
                  >
                    Parent
                    <ArrowUpDown className={`h-3 w-3 ${sortField === "parentName" ? "text-foreground" : ""}`} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Téléphone
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort("sex")}
                  >
                    Sexe
                    <ArrowUpDown className={`h-3 w-3 ${sortField === "sex" ? "text-foreground" : ""}`} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => handleSort("condition")}
                  >
                    Condition
                    <ArrowUpDown className={`h-3 w-3 ${sortField === "condition" ? "text-foreground" : ""}`} />
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Chargement des patients...
                  </td>
                </tr>
              ) : sortedPatients.length > 0 ? (
                sortedPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => handleViewPatient(patient.id)}
                  >
                    <td className="py-3 px-4">{patient.fullName}</td>
                    <td className="py-3 px-4">{patient.parentName}</td>
                    <td className="py-3 px-4">{patient.parentPhone}</td>
                    <td className="py-3 px-4">
                      {patient.sex === 'male' ? 'Masculin' :
                        patient.sex === 'female' ? 'Féminin' :
                          patient.sex === 'other' ? 'Autre' : ''}
                    </td>
                    <td className="py-3 px-4">{patient.condition}</td>
                    <td className="py-3 px-4 text-right">
                      {/* Only show PDF generation button for all users */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeneratePDF(patient);
                        }}
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </Button>

                      {/* Only show dropdown menu if user is not a doctor */}
                      {role !== "doctor" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="action-button">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              setPatientToDelete(patient.id);
                            }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Aucun patient trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          Affichage de {sortedPatients.length} sur {patients.length} patients
        </div>
      </div>

      {/* New Patient Dialog - with mobile-friendly class */}
      {tenantId && (
        <NewPatientDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onPatientAdded={handlePatientAdded}
          tenantId={tenantId}
          className="mobile-friendly-dialog" // Add this class for mobile styling
        />
      )}

      {/* Delete Patient Confirmation Dialog */}
      <AlertDialog open={!!patientToDelete} onOpenChange={(open) => !open && setPatientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le patient
              et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Patients;