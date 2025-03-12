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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouveau patient</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations du patient ci-dessous
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                        <FormField
                            control={form.control}
                            name="birthdate"
                            render={({ field }) => (
                                <FormItem>
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

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Ajout en cours..." : "Ajouter le patient"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}