import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Update the form schema to include birthdate
const formSchema = z.object({
    fullName: z.string().min(2, "Le nom complet est requis"),
    parentName: z.string().min(2, "Le nom du parent est requis"),
    parentPhone: z.string().min(8, "Le numéro de téléphone est requis"),
    secondaryPhone: z.string().optional(),
    parentEmail: z.string().email("Email invalide").optional().or(z.literal("")),
    condition: z.string().min(2, "La condition est requise"),
    sex: z.enum(["male", "female", "other"]),
    birthdate: z.date({
        required_error: "La date de naissance est requise",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewPatientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPatientAdded: (patient: any) => void;
    tenantId: string;
}

// Update the dialogStyles object to include the formContainer property
const dialogStyles = {
    content: "sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col",
    header: "sticky top-0 bg-background z-10 pb-4 border-b",
    footer: "sticky bottom-0 bg-background z-10 pt-4 border-t mt-auto",
    formContainer: "overflow-y-auto flex-1 py-4", // Add this line
    form: "space-y-6 px-1",
    grid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    sectionTitle: "text-lg font-semibold text-foreground/80 border-b pb-2 mb-4",
};

export function NewPatientDialog({
    open,
    onOpenChange,
    onPatientAdded,
    tenantId,
}: NewPatientDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            parentName: "",
            parentPhone: "",
            secondaryPhone: "",
            parentEmail: "",
            condition: "",
            sex: "male",
            // Add default value for birthdate
            birthdate: undefined,
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const patientsRef = collection(db, `${tenantId}/patients/data`);
            const docRef = await addDoc(patientsRef, {
                ...data,
                birthdate: data.birthdate,
                createdAt: serverTimestamp(),
            });

            const newPatient = {
                id: docRef.id,
                ...data,
                birthdate: data.birthdate.toISOString(),
                createdAt: new Date().toISOString(),
            };

            onPatientAdded(newPatient);
            toast.success("Patient ajouté avec succès");
            form.reset();
            onOpenChange(false);
        } catch (error) {
            console.error("Error adding patient:", error);
            toast.error("Erreur lors de l'ajout du patient");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={dialogStyles.content}>
                <DialogHeader className={dialogStyles.header}>
                    <DialogTitle>Ajouter un nouveau patient</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations du patient ci-dessous
                    </DialogDescription>
                </DialogHeader>

                <div className={dialogStyles.formContainer}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={dialogStyles.form}>
                            <div>
                                <h3 className={dialogStyles.sectionTitle}>Informations du patient</h3>
                                <div className="space-y-4">
                                    <div className={dialogStyles.grid}>
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom complet *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nom complet du patient" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sex"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sexe *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Masculin</SelectItem>
                                                            <SelectItem value="female">Féminin</SelectItem>
                                                            <SelectItem value="other">Autre</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className={dialogStyles.grid}>
                                        <FormField
                                            control={form.control}
                                            name="birthdate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Date de naissance *</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP", { locale: fr })
                                                                    ) : (
                                                                        <span>Sélectionner une date</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) =>
                                                                    date > new Date() || date < new Date("1900-01-01")
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="condition"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Condition *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Condition médicale" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className={dialogStyles.sectionTitle}>Informations du parent</h3>
                                <div className="space-y-4">
                                    <div className={dialogStyles.grid}>
                                        {/* Parent fields remain unchanged */}
                                        <FormField
                                            control={form.control}
                                            name="parentName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom du parent *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nom du parent" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="parentPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Téléphone principal *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Téléphone du parent" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className={dialogStyles.sectionTitle}>Informations du parent</h3>
                                <div className="space-y-4">
                                    <div className={dialogStyles.grid}>
                                        <FormField
                                            control={form.control}
                                            name="secondaryPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Téléphone secondaire</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Optionnel" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="parentEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email du parent</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="Optionnel"
                                                            {...field}
                                                            value={field.value || ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Add extra padding at the bottom to ensure content doesn't get hidden behind footer */}
                            <div className="h-4"></div>
                        </form>
                    </Form>
                </div>

                <DialogFooter className={dialogStyles.footer}>
                    <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Ajout en cours..." : "Ajouter le patient"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}