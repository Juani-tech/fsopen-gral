import { Entry } from "../../types";
import HealthCheckEntryView from "./HealthCheckEntry";
import HospitalEntryView from "./HospitalEntry";
import OccupationalHealthcareEntryView from "./OccupationalHealthcareView";

interface EntryProps {
  entries: Entry[];
}

const Entries = ({ entries }: EntryProps) => {
  const entryStyle = {
    borderWidht: "1em",
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: "0.5em",
    padding: "1em",
    marginBottom: "0.5em",
  };
  return (
    <>
      <h2>Entries</h2>
      {entries.map((entry) => {
        switch (entry.type) {
          case "Hospital": {
            return (
              <div key={entry.id} style={entryStyle}>
                <HospitalEntryView entry={entry}></HospitalEntryView>
              </div>
            );
          }
          case "OccupationalHealthcare": {
            return (
              <div key={entry.id} style={entryStyle}>
                <OccupationalHealthcareEntryView
                  entry={entry}
                ></OccupationalHealthcareEntryView>
              </div>
            );
          }
          case "HealthCheck": {
            return (
              <div key={entry.id} style={entryStyle}>
                <HealthCheckEntryView entry={entry}></HealthCheckEntryView>
              </div>
            );
          }
          default: {
            return <p>Not recognized type of entry</p>;
          }
        }
      })}
    </>
  );
};

export default Entries;
