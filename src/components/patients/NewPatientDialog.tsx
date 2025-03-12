import { useState } from "react";
import { UserPlus, Upload, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface NewPatientForm {
    fullName: string;
    parentName: string;
    parentPhone: string;
    secondaryPhone: string;
    parentEmail: string;
    condition: string;
    sex: string;
    documents: File[];
}

interface NewPatientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPatientAdded: (patient: any) => void;
    tenantId: string;
}

export const NewPatientDialog = ({
    open,
    onOpenChange,
    onPatientAdded,
    tenantId
}: NewPatientDialogProps) => {
    const [newPatient, setNewPatient] = useState<NewPatientForm>({
        fullName: "",
        parentName: "",
        parentPhone: "",
        secondaryPhone: "",
        parentEmail: "",
        condition: "",
        sex: "",
        documents: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if all required fields are filled
    const isFormValid =
        newPatient.fullName.trim() !== "" &&
        newPatient.parentName.trim() !== "" &&
        newPatient.parentPhone.trim() !== "" &&
        newPatient.sex !== "";

    // Handle adding a new patient
    const handleAddPatient = async () => {
        if (!isFormValid) return;

        setIsSubmitting(true);

        try {
            const createdAt = new Date().toISOString();

            // Add new patient to Firestore
            const patientsRef = collection(db, `${tenantId}/patients/data`);
            const newPatientData = {
                fullName: newPatient.fullName,
                parentName: newPatient.parentName,
                parentPhone: newPatient.parentPhone,
                secondaryPhone: newPatient.secondaryPhone || "",
                parentEmail: newPatient.parentEmail || "",
                condition: newPatient.condition || "",
                sex: newPatient.sex,
                hasDocuments: newPatient.documents.length > 0,
                createdAt,
            };

            const docRef = await addDoc(patientsRef, newPatientData);

            // TODO: Handle document uploads to Firebase Storage
            // This would be implemented separately with Firebase Storage

            // Add patient to local state via callback
            onPatientAdded({
                id: docRef.id,
                ...newPatientData,
            });

            // Reset form and close dialog
            setNewPatient({
                fullName: "",
                parentName: "",
                parentPhone: "",
                secondaryPhone: "",
                parentEmail: "",
                condition: "",
                sex: "",
                documents: [],
            });

            onOpenChange(false);
            toast.success("Patient ajouté avec succès");
        } catch (error) {
            console.error("Error adding patient:", error);
            toast.error("Erreur lors de l'ajout du patient");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            setNewPatient({ ...newPatient, documents: [...newPatient.documents, ...fileArray] });
        }
    };

    const removeDocument = (index: number) => {
        const updatedDocs = [...newPatient.documents];
        updatedDocs.splice(index, 1);
        setNewPatient({ ...newPatient, documents: updatedDocs });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Ajouter un nouveau patient
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium">
                                Nom complet<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                value={newPatient.fullName}
                                onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                                className="mt-1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sex" className="text-sm font-medium">
                                Sexe<span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={newPatient.sex}
                                onValueChange={(value) => setNewPatient({ ...newPatient, sex: value })}
                            >
                                <SelectTrigger id="sex" className="mt-1">
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Masculin</SelectItem>
                                    <SelectItem value="female">Féminin</SelectItem>
                                    <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentName" className="text-sm font-medium">
                                Nom du parent<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="parentName"
                                value={newPatient.parentName}
                                onChange={(e) => setNewPatient({ ...newPatient, parentName: e.target.value })}
                                className="mt-1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentPhone" className="text-sm font-medium">
                                Téléphone du parent<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="parentPhone"
                                value={newPatient.parentPhone}
                                onChange={(e) => setNewPatient({ ...newPatient, parentPhone: e.target.value })}
                                className="mt-1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="secondaryPhone" className="text-sm font-medium">
                                Téléphone secondaire
                            </Label>
                            <Input
                                id="secondaryPhone"
                                value={newPatient.secondaryPhone}
                                onChange={(e) => setNewPatient({ ...newPatient, secondaryPhone: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentEmail" className="text-sm font-medium">
                                Email du parent
                            </Label>
                            <Input
                                id="parentEmail"
                                type="email"
                                value={newPatient.parentEmail}
                                onChange={(e) => setNewPatient({ ...newPatient, parentEmail: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="condition" className="text-sm font-medium">
                                Condition médicale
                            </Label>
                            <Input
                                id="condition"
                                value={newPatient.condition}
                                onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm font-medium">
                                Documents
                            </Label>
                            <div className="mt-1 border-2 border-dashed rounded-md p-4 bg-secondary/30">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Glissez-déposez des fichiers ici ou
                                    </p>
                                    <Button variant="outline" size="sm" className="relative" type="button">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            multiple
                                        />
                                        Parcourir les fichiers
                                    </Button>
                                </div>

                                {newPatient.documents.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium">Fichiers sélectionnés:</p>
                                        <ul className="space-y-2">
                                            {newPatient.documents.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between bg-background rounded-md p-2 text-sm">
                                                    <span className="truncate max-w-[250px]">{file.name}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => removeDocument(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleAddPatient}
                        disabled={!isFormValid || isSubmitting}
                        className="gap-2"
                    >
                        {isSubmitting ? "Ajout en cours..." : "Ajouter le patient"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};