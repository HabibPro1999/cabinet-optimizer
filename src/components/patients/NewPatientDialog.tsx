import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface NewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientAdded: (patient: any) => void;
  tenantId: string;
  className?: string; // Add className prop
}

export function NewPatientDialog({
  open,
  onOpenChange,
  onPatientAdded,
  tenantId,
  className
}: NewPatientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    parentName: "",
    parentPhone: "",
    secondaryPhone: "",
    parentEmail: "",
    condition: "",
    sex: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.parentName || !formData.parentPhone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Add patient to Firestore
      const patientData = {
        ...formData,
        createdAt: serverTimestamp(),
        hasDocuments: false,
      };
      
      const docRef = await addDoc(collection(db, `${tenantId}/patients/data`), patientData);
      
      // Format the patient data for the UI
      const newPatient = {
        id: docRef.id,
        ...formData,
        createdAt: new Date().toISOString(),
        hasDocuments: false,
      };
      
      onPatientAdded(newPatient);
      onOpenChange(false);
      toast.success("Patient ajouté avec succès");
      
      // Reset form
      setFormData({
        fullName: "",
        parentName: "",
        parentPhone: "",
        secondaryPhone: "",
        parentEmail: "",
        condition: "",
        sex: "",
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Erreur lors de l'ajout du patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "max-w-md mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto",
          "sm:max-w-lg md:max-w-xl",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Ajouter un nouveau patient</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Nom complet <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nom et prénom du patient"
                  className="h-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sex" className="text-sm font-medium">
                  Sexe <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => handleSelectChange("sex", value)}
                >
                  <SelectTrigger id="sex" className="h-9">
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
                <Label htmlFor="condition" className="text-sm font-medium">
                  Condition <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  placeholder="Ex: Autisme, TDAH, etc."
                  className="h-9"
                />
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <h3 className="text-sm font-medium mb-3">Informations du parent/tuteur</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName" className="text-sm font-medium">
                    Nom du parent <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Nom et prénom du parent"
                    className="h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentPhone" className="text-sm font-medium">
                    Téléphone principal <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    placeholder="Numéro de téléphone"
                    className="h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone" className="text-sm font-medium">
                    Téléphone secondaire
                  </Label>
                  <Input
                    id="secondaryPhone"
                    name="secondaryPhone"
                    value={formData.secondaryPhone}
                    onChange={handleChange}
                    placeholder="Numéro de téléphone secondaire"
                    className="h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentEmail" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    placeholder="Adresse email"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 mt-6 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}