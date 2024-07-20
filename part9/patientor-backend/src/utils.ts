import {
  Gender,
  NewPatientEntry,
  Diagnosis,
  HealthCheckRating,
  NewEntry,
  Discharge,
  SickLeave,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect name: " + name);
  }
  return name;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect date format: " + date);
  }
  return date;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Invalid ssn: " + ssn);
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Invalid gender: " + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Invalid occupation: " + occupation);
  }
  return occupation;
};

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
    };
    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};

// Entries
const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error("Invalid description: " + description);
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error("Invalid specialist: " + specialist);
  }
  return specialist;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    isNaN(Number(healthCheckRating)) ||
    !isHealthCheckRating(Number(healthCheckRating))
  ) {
    throw new Error("Invalid Health Check Rating: " + healthCheckRating);
  }
  return Number(healthCheckRating) as HealthCheckRating;
};

const parseDischarge = (object: unknown): Discharge | undefined => {
  if (
    !object ||
    typeof object !== "object" ||
    !("date" in object) ||
    !("criteria" in object)
  ) {
    return undefined;
  }

  return object as Discharge;
};

const parseSickLeave = (object: unknown): SickLeave | undefined => {
  if (
    !object ||
    typeof object !== "object" ||
    !("startDate" in object) ||
    !("endDate" in object)
  ) {
    return undefined;
  }

  return object as SickLeave;
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "type" in object &&
    "description" in object &&
    "date" in object &&
    "diagnosisCodes" in object &&
    "specialist" in object
  ) {
    switch (object.type) {
      case "HealthCheck": {
        if ("healthCheckRating" in object) {
          const newEntry: NewEntry = {
            description: parseDescription(object.description),
            date: parseDate(object.date),
            diagnosisCodes: parseDiagnosisCodes(object),
            type: "HealthCheck",
            specialist: parseSpecialist(object.specialist),
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };
          return newEntry;
        }
        break;
      }
      case "Hospital": {
        const newEntry: NewEntry = {
          description: parseDescription(object.description),
          date: parseDate(object.date),
          diagnosisCodes: parseDiagnosisCodes(object),
          type: "Hospital",
          specialist: parseSpecialist(object.specialist),
          discharge:
            "discharge" in object
              ? parseDischarge(object.discharge)
              : undefined,
        };
        return newEntry;
      }
      case "OccupationalHealthcare": {
        if ("employerName" in object && "sickLeave" in object) {
          const newEntry: NewEntry = {
            description: parseDescription(object.description),
            date: parseDate(object.date),
            diagnosisCodes: parseDiagnosisCodes(object),
            type: "OccupationalHealthcare",
            specialist: parseSpecialist(object.specialist),
            employerName: parseName(object.employerName),
            sickLeave: parseSickLeave(object.sickLeave),
          };
          return newEntry;
        }
        break;
      }
      default: {
        throw new Error("Incorrect data: some fields are missing");
      }
    }
  }

  throw new Error("Incorrect data: some fields are missing");
};

// export enum HealthCheckRating {
//   "Healthy" = 0,
//   "LowRisk" = 1,
//   "HighRisk" = 2,
//   "CriticalRisk" = 3,
// }

// export interface HealthCheck extends BaseEntry {
//   specialist: string;
// }

// export interface HealthCheckEntry extends HealthCheck {
//   type: "HealthCheck";
//   healthCheckRating: HealthCheckRating;
// }

// interface BaseEntry {
//   id: string;
//   description: string;
//   date: string;
//   diagnosisCodes?: Array<Diagnosis["code"]>;
// }
