import { HospitalEntry } from "../../types";
import Diagnoses from "./Diagnoses";

interface HospitalEntryProps {
  entry: HospitalEntry;
}

const HospitalEntryView = ({ entry }: HospitalEntryProps) => {
  return (
    <>
      <p>
        {entry.date.toString()} {entry.description}
      </p>
      {entry.discharge && (
        <div>
          Discharge: {entry.discharge.date.toString()}{" "}
          {entry.discharge.criteria}
        </div>
      )}
      {entry.diagnosisCodes && (
        <Diagnoses diagnoses={entry.diagnosisCodes}></Diagnoses>
      )}
      <p>Diagnosed by: {entry.specialist}</p>
    </>
  );
};

export default HospitalEntryView;
