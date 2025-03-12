import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
    },
    header: {
        marginBottom: 30,
        padding: 10,
        backgroundColor: '#f0f4f8',
        borderRadius: 5,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    section: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderLeft: '4px solid #3498db',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2980b9',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        color: '#7f8c8d',
        width: '40%',
        fontWeight: 'bold',
    },
    value: {
        fontSize: 12,
        color: '#34495e',
        width: '60%',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#95a5a6',
        fontSize: 10,
        borderTop: '1px solid #ecf0f1',
        paddingTop: 10,
    },
});

interface PatientPDFProps {
    patient: {
        fullName: string;
        parentName: string;
        parentPhone: string;
        secondaryPhone?: string;
        parentEmail?: string;
        condition: string;
        sex: string;
        birthdate?: string;
        createdAt: string | { seconds: number; nanoseconds: number };
    };
}

export const PatientPDF = ({ patient }: PatientPDFProps) => {
    // Format date safely
    const formatDate = (dateValue: any) => {
        try {
            if (!dateValue) return "Non spécifié";

            // Handle Firestore timestamp
            if (typeof dateValue === 'object' && 'seconds' in dateValue) {
                return format(new Date(dateValue.seconds * 1000), 'PPP', { locale: fr });
            }

            return format(new Date(dateValue), 'PPP', { locale: fr });
        } catch (error) {
            console.error("Date formatting error:", error);
            return "Format de date invalide";
        }
    };

    // Get current date for the document
    const currentDate = format(new Date(), 'PPP', { locale: fr });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Fiche Patient</Text>
                    <Text style={styles.subtitle}>Généré le {currentDate}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Personnelles</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Nom complet:</Text>
                        <Text style={styles.value}>{patient.fullName || "Non spécifié"}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Sexe:</Text>
                        <Text style={styles.value}>
                            {patient.sex === 'male' ? 'Masculin' :
                                patient.sex === 'female' ? 'Féminin' :
                                    patient.sex === 'other' ? 'Autre' : 'Non spécifié'}
                        </Text>
                    </View>

                    {patient.birthdate && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Date de naissance:</Text>
                            <Text style={styles.value}>{formatDate(patient.birthdate)}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Condition Médicale</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Condition:</Text>
                        <Text style={styles.value}>{patient.condition || "Non spécifié"}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Coordonnées</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Parent/Tuteur:</Text>
                        <Text style={styles.value}>{patient.parentName || "Non spécifié"}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Téléphone principal:</Text>
                        <Text style={styles.value}>{patient.parentPhone || "Non spécifié"}</Text>
                    </View>

                    {patient.secondaryPhone && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Téléphone secondaire:</Text>
                            <Text style={styles.value}>{patient.secondaryPhone}</Text>
                        </View>
                    )}

                    {patient.parentEmail && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{patient.parentEmail}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Administratives</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Date d'ajout:</Text>
                        <Text style={styles.value}>{formatDate(patient.createdAt)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>Cabinet Optimizer - Document confidentiel</Text>
                    <Text>Ce document contient des informations médicales confidentielles.</Text>
                </View>
            </Page>
        </Document>
    );
};