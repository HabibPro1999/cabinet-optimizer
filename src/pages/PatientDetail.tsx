import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit, 
  FileText, 
  Phone, 
  Plus, 
  Trash, 
  User 
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment, Note } from "@/types";

// Mock patient data
const MOCK_PATIENTS = [
  {
    id: "p1",
    fullName: "Sophie Martin",
    parentName: "Jean Martin",
    parentPhone: "+33 6 12 34 56 78",
    condition: "Allergie saisonnière",
    createdAt: "2023-01-15",
    notes: [
      {
        id: "n1",
        appointmentId: "a1",
        doctorId: "d1",
        doctorName: "Dupont",
        content: "Prescription d'antihistaminiques. Contrôle dans 2 semaines.",
        createdAt: "2023-05-10T14:30:00",
      },
      {
        id: "n2",
        appointmentId: "a2",
        doctorId: "d2",
        doctorName: "Moreau",
        content: "Amélioration des symptômes. Continuer le traitement.",
        createdAt: "2023-06-15T10:00:00",
      },
    ],
  },
  // ... other patients
];

// Mock appointments data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    patientName: "Sophie Martin",
    doctorId: "d1",
    doctorName: "Dupont",
    date: "2023-05-10",
    time: "14:30",
    duration: 30,
    status: "done",
  },
  {
    id: "a2",
    patientId: "p1",
    patientName: "Sophie Martin",
    doctorId: "d2",
    doctorName: "Moreau",
    date: "2023-06-15",
    time: "10:00",
    duration: 30,
    status: "done",
  },
  {
    id: "a3",
    patientId: "p1",
    patientName: "Sophie Martin",
    doctorId: "d1",
    doctorName: "Dupont",
    date: "2023-10-30",
    time: "09:00",
    duration: 30,
    status: "confirmed",
  },
];

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Find patient data
  const patient = MOCK_PATIENTS.find(p => p.id === id);
  
  // Get patient appointments
  const patientAppointments = MOCK_APPOINTMENTS.filter(a => a.patientId === id);

  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Le contenu de la note ne peut pas être vide");
      return;
    }

    toast.success("Note ajoutée avec succès");
    setNewNote("");
    setShowNoteForm(false);
  };

  // Handle adding a new appointment
  const handleAddAppointment = () => {
    toast.info("Formulaire d'ajout de rendez-vous ouvert");
  };

  // Navigate back to patients list
  const goBack = () => {
    navigate('/patients');
  };

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Patient non trouvé</h2>
            <p className="text-muted-foreground mb-4">
              Le patient que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={goBack}>
              Retour à la liste des patients
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{patient.fullName}</h1>
          <p className="text-muted-foreground">Dossier patient</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-medium mb-4">Informations</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent</p>
                  <p className="font-medium">{patient.parentName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{patient.parentPhone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">{patient.condition}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="font-medium">
                    {format(new Date(patient.createdAt), "d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex mt-6">
              <Button variant="outline" className="w-full gap-1">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Rendez-vous</h2>
              <Button size="sm" className="gap-1" onClick={handleAddAppointment}>
                <Plus className="h-4 w-4" />
                Nouveau
              </Button>
            </div>

            {patientAppointments.length > 0 ? (
              <div className="space-y-3">
                {patientAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Dr. {appointment.doctorName}</p>
                      <span
                        className={`status-badge status-badge-${appointment.status}`}
                      >
                        {appointment.status === "pending"
                          ? "En attente"
                          : appointment.status === "confirmed"
                          ? "Confirmé"
                          : appointment.status === "done"
                          ? "Terminé"
                          : "Annulé"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {format(new Date(appointment.date), "d MMMM yyyy", { locale: fr })}
                      </span>
                      <Clock className="h-3.5 w-3.5 ml-2" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Aucun rendez-vous
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Historique des notes</h2>
              <Button size="sm" className="gap-1" onClick={() => setShowNoteForm(true)}>
                <Plus className="h-4 w-4" />
                Ajouter une note
              </Button>
            </div>

            {showNoteForm && (
              <div className="mb-6 p-4 border border-border rounded-lg bg-secondary/30">
                <h3 className="font-medium mb-3">Nouvelle note</h3>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 h-24 resize-none"
                  placeholder="Saisissez votre note ici..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" onClick={() => setShowNoteForm(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddNote}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}

            {patient.notes && patient.notes.length > 0 ? (
              <div className="space-y-4">
                {patient.notes.map((note: Note) => (
                  <div key={note.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {note.doctorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">Dr. {note.doctorName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(note.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                Aucune note disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail;
