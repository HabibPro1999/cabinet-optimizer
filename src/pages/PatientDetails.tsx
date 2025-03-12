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
    Heart
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
    const { tenantId } = useAuth();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center space-x-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate("/patients")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Chargement du patient...</h1>
                    </div>
                </div>
            </DashboardLayout>
        );
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
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={() => navigate("/patients")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">{patient.fullName}</h1>
                        <p className="text-muted-foreground">
                            Patient depuis le {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            ID du patient: {patientId}
                        </p>
                    </div>
                </div>
                <div>
                    {isEditing ? (
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                <X className="h-4 w-4 mr-2" />
                                Annuler
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                            <CardDescription>
                                Informations de base du patient
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nom complet</Label>
                                {isEditing ? (
                                    <Input
                                        id="fullName"
                                        value={editedPatient?.fullName}
                                        onChange={(e) => setEditedPatient({ ...editedPatient!, fullName: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.fullName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sex">Sexe</Label>
                                {isEditing ? (
                                    <Select
                                        value={editedPatient?.sex}
                                        onValueChange={(value) => setEditedPatient({ ...editedPatient!, sex: value })}
                                    >
                                        <SelectTrigger id="sex">
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Masculin</SelectItem>
                                            <SelectItem value="female">Féminin</SelectItem>
                                            <SelectItem value="other">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {patient.sex === 'male' ? 'Masculin' :
                                                patient.sex === 'female' ? 'Féminin' :
                                                    patient.sex === 'other' ? 'Autre' : ''}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="condition">Condition médicale</Label>
                                {isEditing ? (
                                    <Input
                                        id="condition"
                                        value={editedPatient?.condition}
                                        onChange={(e) => setEditedPatient({ ...editedPatient!, condition: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary/20">
                                        <Heart className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.condition || "Non spécifié"}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du parent</CardTitle>
                            <CardDescription>
                                Coordonnées du parent ou tuteur
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <span>{patient.parentName}</span>
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
                                        <span>{patient.parentPhone}</span>
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
                                        <span>{patient.secondaryPhone || "Non spécifié"}</span>
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
                                        <span>{patient.parentEmail || "Non spécifié"}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appointments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des rendez-vous</CardTitle>
                            <CardDescription>
                                Tous les rendez-vous passés et à venir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Aucun rendez-vous trouvé pour ce patient</p>
                                <Button variant="outline" className="mt-4">
                                    Planifier un rendez-vous
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>
                                Documents médicaux et autres fichiers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                            <CardDescription>
                                Notes cliniques et observations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
        </DashboardLayout>
    );
};

export default PatientDetails;