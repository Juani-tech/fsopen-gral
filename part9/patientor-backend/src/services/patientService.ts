import patientData from "../../data/patients";
import {
  NewEntry,
  NewPatientEntry,
  Patient,
  PatientWithoutSSN,
} from "../types";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData;

const getPatientsWithoutSSN = (): PatientWithoutSSN[] => {
  return patients.map(
    ({ id, name, dateOfBirth, ssn: _ssn, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient => {
  const foundPatient = patients.find((patient) => patient.id === id);

  if (foundPatient) {
    return foundPatient;
  } else {
    throw new Error("No patient found with id: " + id);
  }
};

const addEntry = (patientId: string, newEntry: NewEntry) => {
  const foundPatient = patients.find(({ id }) => patientId === id);

  if (!foundPatient) {
    throw new Error("No patient found for the id: " + patientId);
  }
  const entry = {
    id: uuid(),
    ...newEntry,
  };
  foundPatient.entries = foundPatient.entries.concat(entry);

  const updatedPatient: Patient = {
    ...foundPatient,
  };

  patients.map((patient) =>
    patient.id === updatedPatient.id ? updatedPatient : patient
  );

  return updatedPatient;
};

export default {
  getPatientsWithoutSSN,
  addPatient,
  getPatientById,
  addEntry,
};
