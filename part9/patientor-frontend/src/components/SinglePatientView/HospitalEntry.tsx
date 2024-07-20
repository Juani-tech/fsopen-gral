import { HospitalEntry } from "../../types";
import Diagnoses from "./Diagnoses";

interface HospitalEntryProps {
  entry: HospitalEntry;
}

const HospitalEntryView = ({ entry }: HospitalEntryProps) => {
  return (
    <>
      <p>
        {entry.date} {entry.description}
      </p>
      {entry.discharge && (
        <div>
          Discharge: {entry.discharge.date} {entry.discharge.criteria}
        </div>
      )}
      {entry.diagnosisCodes && (
        <Diagnoses diagnoses={entry.diagnosisCodes}></Diagnoses>
      )}
    </>
  );
};

export default HospitalEntryView;
