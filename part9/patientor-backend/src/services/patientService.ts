import patientData from "../../data/patients";
import { NewPatientEntry, Patient, PatientWithoutSSN } from "../types";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData;

const getPatientsWithoutSSN = (): PatientWithoutSSN[] => {
  return patients.map(
    ({ id, name, dateOfBirth, ssn: _ssn, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatientsWithoutSSN,
  addPatient,
};
