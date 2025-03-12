
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

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new patient to the local state
  const handlePatientAdded = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
  };

  // Handle viewing a patient's details
  const handleViewPatient = (patientId: string) => {
    console.log("Debug - Navigating with ID:", patientId); // Add this debug log
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
      const blob = await pdf(<PatientPDF patient={patient} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `patient-${patient.fullName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF généré avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
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
            {/* Only show Add Patient button if user is not a doctor */}
            {role !== "doctor" && (
              <Button size="sm" className="w-full sm:w-auto gap-1" onClick={() => setShowAddDialog(true)}>
                <UserPlus className="h-4 w-4" />
                <span>Nouveau patient</span>
              </Button>
            )}
          </div>
        </div>

        {/* Replace the table with a responsive card layout for mobile */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Chargement des patients...
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 hover:bg-secondary/50 transition-colors"
                  onClick={() => handleViewPatient(patient.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{patient.fullName}</h3>
                    <div className="flex">
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

                      {role !== "doctor" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPatientToDelete(patient.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Aucun patient trouvé
            </div>
          )}
        </div>

        {/* Keep the table for desktop view */}
        <div className="hidden md:block overflow-x-auto">
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
                    Sexe
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Chargement des patients...
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      // Prevent navigation when clicking on action buttons
                      if ((e.target as HTMLElement).closest('.action-button')) {
                        e.stopPropagation();
                        return;
                      }
                      handleViewPatient(patient.id);
                    }}
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
          Affichage de {filteredPatients.length} sur {patients.length} patients
        </div>
      </div>

      {/* New Patient Dialog */}
      {tenantId && (
        <NewPatientDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onPatientAdded={handlePatientAdded}
          tenantId={tenantId}
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
