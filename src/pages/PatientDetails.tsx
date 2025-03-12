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
import { AnimatedTabs } from "@/components/ui/animated-tabs";

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

const PatientDetails = () => {
    const params = useParams();
    console.log("Debug - Raw params:", params);

    const patientId = params.patientId;
    console.log("Debug - Extracted patientId:", patientId);

    const navigate = useNavigate();
    const { tenantId, role } = useAuth(); // Update this line to get userRole
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        const fetchPatient = async () => {
            if (!patientId || !tenantId) {
                console.log("Missing patientId or tenantId:", { patientId, tenantId });
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                console.log("Fetching patient data:", { patientId, tenantId });

                const patientRef = doc(db, `${tenantId}/patients/data/${patientId}`);
                const patientSnap = await getDoc(patientRef);

                if (patientSnap.exists()) {
                    const data = patientSnap.data();
                    console.log("Patient data retrieved:", data);

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
                    console.log("Patient not found");
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

    // Add this new component at the top of the file
    const PatientDetailsSkeleton = () => {
        return (
            <DashboardLayout showBackButton>
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded-md"></div>
                        <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="h-10 w-96 bg-muted animate-pulse rounded-md"></div>
                </div>

                <div className="space-y-6">
                    <div className="border rounded-lg p-6 space-y-4">
                        <div className="space-y-2">
                            <div className="h-6 w-40 bg-muted animate-pulse rounded-md"></div>
                            <div className="h-4 w-60 bg-muted animate-pulse rounded-md"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
                                    <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 space-y-4">
                        <div className="space-y-2">
                            <div className="h-6 w-40 bg-muted animate-pulse rounded-md"></div>
                            <div className="h-4 w-60 bg-muted animate-pulse rounded-md"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
                                    <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    };

    // Replace the loading state in the component
    if (isLoading) {
        return <PatientDetailsSkeleton />;
    }

    if (!patient) {
        return (
            <DashboardLayout>
                <div className="flex items-center space-x-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate("/patients")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Patient non trouvé</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            ID du patient: {patientId}
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout showBackButton onBack={() => navigate("/patients")}>
            <div className="pb-6"> {/* Changed from pb-20 and removed sm:pb-0 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">{patient.fullName}</h1>
                        <p className="text-sm text-muted-foreground">
                            Patient depuis le {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            ID du patient: {patientId}
                        </p>
                    </div>
                    {/* Move buttons to desktop only */}
                    {role !== "doctor" && (
                        <div className="hidden sm:flex">
                            {isEditing ? (
                                <div className="flex space-x-2">
                                    <Button variant="outline" onClick={handleCancel} disabled={isSaving} size="sm" className="px-2 py-1">
                                        <X className="h-3 w-3 mr-1" />
                                        <span className="text-xs">Annuler</span>
                                    </Button>
                                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="px-2 py-1">
                                        <Save className="h-3 w-3 mr-1" />
                                        <span className="text-xs">{isSaving ? "..." : "Enregistrer"}</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Button onClick={() => setIsEditing(true)} size="sm" className="px-2 py-1">
                                        <Edit2 className="h-3 w-3 mr-1" />
                                        <span className="text-xs">Modifier</span>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowDeleteDialog(true)}
                                        size="sm"
                                        className="px-2 py-1"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        <span className="text-xs">Supprimer</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Replace the existing Tabs with AnimatedTabs */}
                <div className="w-full space-y-6">
                    <AnimatedTabs
                        tabs={[
                            { id: "info", label: "Informations", mobileLabel: "Info" },
                            { id: "appointments", label: "Rendez-vous", mobileLabel: "RDV" },
                            { id: "documents", label: "Documents", mobileLabel: "Docs" },
                            { id: "notes", label: "Notes", mobileLabel: "Notes" }
                        ]}
                        defaultTab="info"
                        onChange={(tabId) => setActiveTab(tabId)}
                    />

                    {/* Content sections */}
                    <div className="mt-6 space-y-6">
                        {activeTab === "info" && (
                            <div className="space-y-4 sm:space-y-6">
                                <Card>
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle>Informations personnelles</CardTitle>
                                        <CardDescription>
                                            Informations de base du patient
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-4 p-4 sm:p-6 sm:gap-6">
                                        {/* Modify all form fields to be read-only for doctors */}
                                        {/* Example for the first field: */}
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Nom complet</Label>
                                            {isEditing && role !== "doctor" ? (
                                                <Input
                                                    id="fullName"
                                                    value={editedPatient?.fullName}
                                                    onChange={(e) => setEditedPatient({ ...editedPatient!, fullName: e.target.value })}
                                                />
                                            ) : (
                                                <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm sm:text-base break-words">{patient.fullName}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Apply the same pattern to all other form fields */}
                                        {/* ... */}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle>Informations du parent</CardTitle>
                                        <CardDescription>
                                            Coordonnées du parent ou tuteur
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-4 p-4 sm:p-6 sm:gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="parentName">Nom du parent</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="parentName"
                                                    value={editedPatient?.parentName}
                                                    onChange={(e) => setEditedPatient({ ...editedPatient!, parentName: e.target.value })}
                                                />
                                            ) : (
                                                <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm sm:text-base break-words">{patient.parentName}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="parentPhone">Téléphone principal</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="parentPhone"
                                                    value={editedPatient?.parentPhone}
                                                    onChange={(e) => setEditedPatient({ ...editedPatient!, parentPhone: e.target.value })}
                                                />
                                            ) : (
                                                <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm sm:text-base break-words">{patient.parentPhone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
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
                                                    <span className="text-sm sm:text-base break-words">{patient.secondaryPhone || "Non spécifié"}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
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
                                                    <span className="text-sm sm:text-base break-words">{patient.parentEmail || "Non spécifié"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === "appointments" && (
                            <Card>
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle>Historique des rendez-vous</CardTitle>
                                    <CardDescription>
                                        Tous les rendez-vous passés et à venir
                                    </CardDescription>
                                </CardHeader>
                                {/* ... rest of appointments content ... */}
                            </Card>
                        )}

                        {activeTab === "documents" && (
                            <Card>
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle>Documents</CardTitle>
                                    <CardDescription>
                                        Documents médicaux et autres fichiers
                                    </CardDescription>
                                </CardHeader>
                                {/* ... rest of documents content ... */}
                            </Card>
                        )}

                        {activeTab === "notes" && (
                            <Card>
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle>Notes</CardTitle>
                                    <CardDescription>
                                        Notes cliniques et observations
                                    </CardDescription>
                                </CardHeader>
                                {/* ... rest of notes content ... */}
                            </Card>
                        )}
                    </div>
                </div>

                {/* Move mobile buttons here, after the content */}
                {role !== "doctor" && (
                    <div className="sm:hidden border-t bg-background p-4">
                        <div className="flex justify-end space-x-2">
                            {isEditing ? (
                                <>
                                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                        <X className="h-4 w-4 mr-2" />
                                        Annuler
                                    </Button>
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {isSaving ? "..." : "Enregistrer"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Alert Dialog */}
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