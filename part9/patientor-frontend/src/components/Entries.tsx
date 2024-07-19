import { BaseEntry } from "../types";

interface EntryProps {
  entries: BaseEntry[];
}

const Entries = ({ entries }: EntryProps) => {
  return (
    <>
      {entries.map((entry) => {
        return (
          <div key={entry.id}>
            <p>
              {entry.date} <em>{entry.description}</em>
            </p>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((diagnoseCode) => (
                  <li key={diagnoseCode}>{diagnoseCode}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Entries;
