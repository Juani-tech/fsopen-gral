import { useEffect, useState } from "react";
import { Diagnosis } from "../../types";
import diagnosesService from "../../services/diagnoses";

interface DiagnosisProps {
  diagnoses: Array<Diagnosis["code"]>;
}

const Diagnoses = ({ diagnoses }: DiagnosisProps) => {
  const [fetchedDiagnoses, setFetchedDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    diagnosesService.getDiagnoses().then((fetchedDiagnoses) => {
      const filteredDiagnoses = fetchedDiagnoses.filter(({ code }) =>
        diagnoses.includes(code)
      );

      setFetchedDiagnoses(filteredDiagnoses);
    });
  });

  return (
    <ul>
      {fetchedDiagnoses.map(({ name, code }) => {
        return (
          <li key={code}>
            {code} {name}
          </li>
        );
      })}
    </ul>
  );
};

export default Diagnoses;
