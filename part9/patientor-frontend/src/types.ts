export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: BaseEntry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;
