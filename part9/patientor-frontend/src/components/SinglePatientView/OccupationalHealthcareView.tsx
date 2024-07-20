import { OccupationalHealthcareEntry } from "../../types";
import Diagnoses from "./Diagnoses";

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcareEntryView = ({
  entry,
}: OccupationalHealthcareProps) => {
  return (
    <>
      <p>
        {entry.date.toString()} {entry.description}
      </p>
      <p>Employer name: {entry.employerName}</p>
      {entry.diagnosisCodes && (
        <div>
          <h3>Sick leave</h3>
          <p>Start date: {entry.sickLeave?.startDate.toString()} </p>
          <p>End date: {entry.sickLeave?.endDate}</p>
        </div>
      )}
      {entry.diagnosisCodes && (
        <Diagnoses diagnoses={entry.diagnosisCodes}></Diagnoses>
      )}
      <p>Diagnose by {entry.specialist}</p>
    </>
  );
};

export default OccupationalHealthcareEntryView;
