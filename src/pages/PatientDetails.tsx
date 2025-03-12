import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Edit2,
    Save,
    X,
    FileText,
    Calendar,
    Phone,
    Mail,
    User,
    Heart,
    Trash2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

// Add this new component for the shimmer effect
const Shimmer = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse bg-muted rounded-md", className)} />
);

const PatientDetails = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const { tenantId, role } = useAuth(); // Update this line to get userRole
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!patientId || !tenantId) return;

            try {
                setIsLoading(true);
                const patientRef = doc(db, `${tenantId}/patients/data/${patientId}`);
                const patientSnap = await getDoc(patientRef);

                if (patientSnap.exists()) {
                    const data = patientSnap.data();
                    const patientData = {
                        id: patientId,
                        fullName: data.fullName || "",
                        parentName: data.parentName || "",
                        parentPhone: data.parentPhone || "",
                        secondaryPhone: data.secondaryPhone || "",
                        parentEmail: data.parentEmail || "",
                        condition: data.condition || "",
                        sex: data.sex || "",
                        hasDocuments: data.hasDocuments || false,
                        createdAt: data.createdAt || "",
                    };
                    setPatient(patientData);
                    setEditedPatient(patientData);
                } else {
                    toast.error("Patient non trouvé");
                    navigate("/patients");
                }
            } catch (error) {
                console.error("Error fetching patient:", error);
                toast.error("Erreur lors du chargement du patient");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatient();
    }, [patientId, tenantId, navigate]);

    const handleSave = async () => {
        if (!editedPatient || !patientId || !tenantId) return;

        try {
            setIsSaving(true);
            const patientRef = doc(db, `${tenantId}/patients/data/${patientId}`);

            // Prepare data for update (exclude id and createdAt)
            const { id, createdAt, ...updateData } = editedPatient;

            await updateDoc(patientRef, updateData);

            setPatient(editedPatient);
            setIsEditing(false);
            toast.success("Patient mis à jour avec succès");
        } catch (error) {
            console.error("Error updating patient:", error);
            toast.error("Erreur lors de la mise à jour du patient");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedPatient(patient);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!patientId || !tenantId) return;

        try {
            setIsDeleting(true);
            const patientRef = doc(db, `${tenantId}/patients/data/${patientId}`);
            await deleteDoc(patientRef);

            toast.success("Patient supprimé avec succès");
            navigate("/patients");
        } catch (error) {
            console.error("Error deleting patient:", error);
            toast.error("Erreur lors de la suppression du patient");
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                {/* Fixed position back button that appears during loading */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 z-50 sm:static sm:top-auto sm:z-auto"
                    onClick={() => navigate("/patients")}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                {/* Shimmer loading UI */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div className="flex items-center space-x-3">
                        {/* Empty space for the back button */}
                        <div className="w-9 h-9 invisible"></div>
                        <div className="ml-12 sm:ml-0">
                            <Shimmer className="h-7 w-48 mb-2" />
                            <Shimmer className="h-4 w-36" />
                        </div>
                    </div>
                    <div className="flex mt-2 sm:mt-0 gap-2">
                        <Shimmer className="h-9 w-24" />
                        <Shimmer className="h-9 w-24" />
                    </div>
                </div>

                {/* Shimmer tabs */}
                <div className="mb-4 md:mb-6 w-full grid grid-cols-4 h-10 gap-1 bg-muted rounded-md p-1">
                    {[...Array(4)].map((_, i) => (
                        <Shimmer key={i} className="h-8 rounded-sm" />
                    ))}
                </div>

                {/* Shimmer content */}
                <div className="space-y-4 md:space-y-6">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 md:p-6 border-b">
                            <Shimmer className="h-6 w-40 mb-2" />
                            <Shimmer className="h-4 w-60" />
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <Shimmer className="h-4 w-24" />
                                    <Shimmer className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 md:p-6 border-b">
                            <Shimmer className="h-6 w-40 mb-2" />
                            <Shimmer className="h-4 w-60" />
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <Shimmer className="h-4 w-24" />
                                    <Shimmer className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!patient) {
        return (
            <DashboardLayout>
                {/* Fixed position back button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 z-50 sm:static sm:top-auto sm:z-auto"
                    onClick={() => navigate("/patients")}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="ml-12 sm:ml-0 mt-2 sm:mt-0">
                    <h1 className="text-xl md:text-2xl font-semibold">Patient non trouvé</h1>
                    <p className="text-sm text-muted-foreground">
                        Le patient que vous recherchez n'existe pas ou a été supprimé
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Back button positioned at the top for web view */}
            <div className="hidden sm:block mb-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/patients")}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Improved mobile header with better spacing and responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div className="flex items-center space-x-3">
                    {/* Mobile-only back button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="fixed top-4 z-50 sm:hidden"
                        onClick={() => navigate("/patients")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="ml-12 sm:ml-0">
                        <h1 className="text-xl md:text-2xl font-semibold truncate">{patient.fullName}</h1>
                        <p className="text-sm text-muted-foreground">
                            Patient depuis le {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                </div>
                {/* Only show edit/delete buttons if user is not a doctor */}
                {role !== "doctor" && (
                    <div className="flex mt-2 sm:mt-0">
                        {isEditing ? (
                            <div className="flex space-x-2 w-full sm:w-auto">
                                <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="flex-1 sm:flex-none text-xs sm:text-sm h-9">
                                    <X className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                                    Annuler
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none text-xs sm:text-sm h-9">
                                    <Save className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                                    {isSaving ? "..." : "Enregistrer"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2 w-full sm:w-auto">
                                <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none text-xs sm:text-sm h-9">
                                    <Edit2 className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                                    Modifier
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="flex-1 sm:flex-none text-xs sm:text-sm h-9"
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                                    Supprimer
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Improved tabs for mobile */}
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="mb-4 md:mb-6 w-full grid grid-cols-4 h-auto">
                    <TabsTrigger value="info" className="py-2 text-xs md:text-sm">Infos</TabsTrigger>
                    <TabsTrigger value="appointments" className="py-2 text-xs md:text-sm">RDV</TabsTrigger>
                    <TabsTrigger value="documents" className="py-2 text-xs md:text-sm">Docs</TabsTrigger>
                    <TabsTrigger value="notes" className="py-2 text-xs md:text-sm">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 md:space-y-6">
                    <Card>
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-base md:text-lg">Informations personnelles</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Informations de base du patient
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0 grid grid-cols-1 gap-4 md:gap-6">
                            {/* Modify all form fields to be read-only for doctors */}
                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="fullName" className="text-xs md:text-sm">Nom complet</Label>
                                {isEditing && role !== "doctor" ? (
                                    <Input
                                        id="fullName"
                                        value={editedPatient?.fullName}
                                        onChange={(e) => setEditedPatient({ ...editedPatient!, fullName: e.target.value })}
                                        className="h-9"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20 text-sm">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{patient.fullName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Apply the same pattern to all other form fields */}
                            {/* ... */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-base md:text-lg">Informations du parent</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Coordonnées du parent ou tuteur
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0 grid grid-cols-1 gap-4 md:gap-6">
                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="parentName" className="text-xs md:text-sm">Nom du parent</Label>
                                {isEditing ? (
                                    <Input
                                        id="parentName"
                                        value={editedPatient?.parentName}
                                        onChange={(e) => setEditedPatient({ ...editedPatient!, parentName: e.target.value })}
                                        className="h-9"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20 text-sm">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{patient.parentName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="parentPhone" className="text-xs md:text-sm">Téléphone principal</Label>
                                {isEditing ? (
                                    <Input
                                        id="parentPhone"
                                        value={editedPatient?.parentPhone}
                                        onChange={(e) => setEditedPatient({ ...editedPatient!, parentPhone: e.target.value })}
                                        className="h-9"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20 text-sm">
                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{patient.parentPhone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="secondaryPhone">Téléphone secondaire</Label>
                                {isEditing ? (
                                    <Input
                                        id="secondaryPhone"
                                        value={editedPatient?.secondaryPhone}
                                        onChange={(e) => setEditedPatient({ ...editedPatient!, secondaryPhone: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.secondaryPhone || "Non spécifié"}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <Label htmlFor="parentEmail">Email</Label>
                                {isEditing ? (
                                    <Input
                                        id="parentEmail"
                                        type="email"
                                        value={editedPatient?.parentEmail}
                                        onChange={(e) => setEditedPatient({ ...editedPatient!, parentEmail: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.parentEmail || "Non spécifié"}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appointments">
                    <Card>
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-base md:text-lg">Historique des rendez-vous</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Tous les rendez-vous passés et à venir
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0">
                            <div className="text-center py-6 md:py-8 text-muted-foreground">
                                <Calendar className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-20" />
                                <p className="text-sm">Aucun rendez-vous trouvé pour ce patient</p>
                                <Button variant="outline" className="mt-3 md:mt-4 h-9 text-xs md:text-sm">
                                    Planifier un rendez-vous
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents">
                    <Card>
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-base md:text-lg">Documents</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Documents médicaux et autres fichiers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Aucun document trouvé pour ce patient</p>
                                <Button variant="outline" className="mt-4">
                                    Ajouter un document
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes">
                    <Card>
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-base md:text-lg">Notes</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                Notes cliniques et observations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Aucune note trouvée pour ce patient</p>
                                <Button variant="outline" className="mt-4">
                                    Ajouter une note
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Only render delete dialog if user is not a doctor */}
            {role !== "doctor" && (
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela supprimera définitivement le patient
                                {patient?.fullName && <strong> {patient.fullName}</strong>} et toutes ses données associées.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeleting ? "Suppression..." : "Supprimer"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </DashboardLayout>
    );
};

export default PatientDetails;