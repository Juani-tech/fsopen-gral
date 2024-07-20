import { Patient } from "../../types";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import Entries from "./Entries";
import EntryForm from "./EntryForm";

interface PatientProps {
  patientId: string | null | undefined;
}

const PatientView = ({ patientId }: PatientProps) => {
  const [patient, setPatient] = useState<Patient>();
  useEffect(() => {
    if (patientId) {
      patientService
        .getById(patientId)
        .then((foundPatient) => setPatient(foundPatient));
    }
  }, [patientId]);

  if (!patient) {
    return (
      <div style={{ marginTop: "1em" }}>
        <em>Patient not found</em>
      </div>
    );
  }

  return (
    <>
      <EntryForm></EntryForm>
      <h3>{patient.name}</h3>
      {patient.gender === "male" && <MaleIcon></MaleIcon>}
      {patient.gender === "female" && <FemaleIcon></FemaleIcon>}
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      {patient.entries && <Entries entries={patient.entries}></Entries>}
    </>
  );
};

export default PatientView;
