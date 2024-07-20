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

interface HealthCheckEntryFormProps {
  show: boolean;
  resetForm: () => void;
  patientId: string | null | undefined;
}

const HospitalEntryForm = ({
  show,
  resetForm,
  patientId,
}: HealthCheckEntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCode, setDiagnosisCode] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckrating] = useState(0);
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

  const handleDiagnosisCodesChange = (event: SelectChangeEvent) => {
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

  const changeHealthCheckRatingChange = (event: SelectChangeEvent) => {
    setHealthCheckrating(Number(event.target.value));
  };

  const onAdd = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // send and then =>
    if (patientId) {
      const newEntry: NewEntry = {
        description,
        date,
        diagnosisCodes,
        type: "HealthCheck",
        specialist,
        healthCheckRating,
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
      <h2>New Hospital Entry</h2>
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
              onChange={handleDiagnosisCodesChange}
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
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="diagnosis-code-input">
            Healthcheck Rating:{" "}
          </InputLabel>
          <Select
            labelId="diagnosis-code-select-label"
            id="diagnosis-code-select"
            value={healthCheckRating.toString()}
            onChange={changeHealthCheckRatingChange}
            label="Healthcheck Rating"
          >
            <MenuItem value={0}>Healthy</MenuItem>
            <MenuItem value={1}>Low Risk</MenuItem>
            <MenuItem value={2}>High Risk</MenuItem>
            <MenuItem value={3}>Critical Risk</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" style={inputStyle}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default HospitalEntryForm;
