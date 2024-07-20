import { TextField, Button } from "@mui/material";
import React, { useState } from "react";
import Alert from "@mui/material/Alert";

interface HospitalEntryFormProps {
  show: boolean;
  resetForm: () => void;
}
// export interface BaseEntry {
//   id: string;
//   description: string;
//   type: string;
//   date: string;
//   diagnosisCodes?: Array<Diagnosis["code"]>;
/// }
// Y un discharge
const HospitalEntryForm = ({ show, resetForm }: HospitalEntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [diagnosisCode, setDiagnosisCode] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  //   const [dischargeDate, setDischargeDate] = useState(new Date());
  //   const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [alert, setAlert] = useState("");
  if (!show) {
    return null;
  }

  const onAdd = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // send and then =>
    console.log("date:" + date);
    console.log("diagnosisCodes:" + diagnosisCodes);
    resetForm();
  };

  const addDiagnosisCode = (code: string) => {
    if (diagnosisCodes.includes(code)) {
      setDiagnosisCode("");
      setAlert("Diagnosis codes cannot be repeated");
      setTimeout(() => {
        setAlert("");
      }, 5000);
      return;
    }
    setDiagnosisCodes(diagnosisCodes.concat(code));
    setDiagnosisCode("");
  };
  return (
    <>
      {alert !== "" && <Alert severity="error">{alert}</Alert>}
      <form onSubmit={onAdd}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <input
          value="2024-07-18"
          type="date"
          onChange={({ target }) => setDate(new Date(target.value))}
        ></input>
        <TextField
          label="Diagnosis code"
          fullWidth
          value={diagnosisCode}
          onChange={({ target }) => setDiagnosisCode(target.value)}
        />
        <Button onClick={() => addDiagnosisCode(diagnosisCode)}>
          Add diagnosis code
        </Button>
        <div>
          Added diagnosis codes:{" "}
          {diagnosisCodes.map((d) => (
            <span key={d}>{d} </span>
          ))}
        </div>
      </form>
    </>
  );
};

export default HospitalEntryForm;
