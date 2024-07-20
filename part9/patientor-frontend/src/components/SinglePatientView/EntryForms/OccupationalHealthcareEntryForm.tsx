import { TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import diagnosesService from "../../../services/diagnoses";
import patientsService from "../../../services/patients";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Diagnosis, NewEntry } from "../../../types";

interface OccupationalHealthcareEntryFormProps {
  show: boolean;
  resetForm: () => void;
  patientId: string | null | undefined;
}

const OccupationalHealthcareEntryForm = ({
  show,
  resetForm,
  patientId,
}: OccupationalHealthcareEntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [specialist, setSpecialist] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState(new Date());
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState(new Date());
  const [diagnosisCode, setDiagnosisCode] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [alert, setAlert] = useState("");
  const [
    availableDiagnosisCodes,
    setAvailableDiagnosisCodesavailableDiagnosisCodes,
  ] = useState<Diagnosis[]>([]);

  useEffect(() => {
    diagnosesService
      .getDiagnoses()
      .then((diagnoses) =>
        setAvailableDiagnosisCodesavailableDiagnosisCodes(diagnoses)
      );
  }, []);

  if (!show) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent) => {
    const code = event.target.value;
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

  const onAdd = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // send and then =>
    if (patientId) {
      let newEntry: NewEntry;
      if (sickLeaveStartDate && sickLeaveEndDate) {
        newEntry = {
          description,
          date,
          diagnosisCodes,
          type: "OccupationalHealthcare",
          specialist,
          employerName,
          sickLeave: {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          },
        };
      }
      newEntry = {
        description,
        date,
        diagnosisCodes,
        type: "OccupationalHealthcare",
        specialist,
        employerName,
      };
      const patient = patientsService.createNewEntry(patientId, newEntry);
      console.log("Patient;", patient);
      resetForm();
    }
  };

  const inputStyle = {
    marginTop: "0.5em",
  };

  const containerStyle = {
    borderWidth: "0.1em",
    borderStyle: "solid",
    borderRadius: "0.5em",
    paddingBottom: "1em",
  };

  return (
    <Container style={containerStyle}>
      {alert !== "" && <Alert severity="error">{alert}</Alert>}
      <h2>New Occupatioal Healthcare Entry</h2>
      <form onSubmit={onAdd}>
        <TextField
          label="Specialist"
          fullWidth
          style={inputStyle}
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <InputLabel style={inputStyle} id="date">
          Entry Date
        </InputLabel>
        <input
          style={inputStyle}
          type="date"
          onChange={({ target }) => setDate(new Date(target.value))}
        ></input>
        <TextField
          label="Description"
          fullWidth
          style={inputStyle}
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <div>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="diagnosis-code-input">
              New Diagnosis Code
            </InputLabel>
            <Select
              labelId="diagnosis-code-select-label"
              id="diagnosis-code-select"
              value={diagnosisCode}
              onChange={handleChange}
              label="Diagnosis code"
            >
              {availableDiagnosisCodes.map((d) => (
                <MenuItem key={d.code} value={d.code}>
                  {d.code} {" -"} {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={inputStyle}>
          Added diagnosis codes:{" "}
          {diagnosisCodes.map((d) =>
            d === diagnosisCodes[diagnosisCodes.length - 1] ? (
              <span key={d}>{d} </span>
            ) : (
              <span key={d}>{d}, </span>
            )
          )}
        </div>
        <TextField
          label="Employer name"
          fullWidth
          style={inputStyle}
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
        />
        <div>
          <InputLabel style={inputStyle} id="sick-leave-start-date">
            Sick Leave Start Date
          </InputLabel>
          <input
            type="date"
            style={{ marginTop: "1em" }}
            onChange={({ target }) =>
              setSickLeaveStartDate(new Date(target.value))
            }
          ></input>
          <InputLabel style={inputStyle} id="sick-leave-end-date">
            Sick Leave End Date
          </InputLabel>
          <input
            type="date"
            style={{ marginTop: "1em" }}
            onChange={({ target }) =>
              setSickLeaveEndDate(new Date(target.value))
            }
          ></input>
        </div>
        <Button type="submit" style={inputStyle}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default OccupationalHealthcareEntryForm;
