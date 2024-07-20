import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import HospitalEntryForm from "./HospitalEntryForm";

const EntryForm = () => {
  const [formShown, setFormShown] = useState("");

  console.log("formShown " + formShown);
  const handleChange = (event: SelectChangeEvent) => {
    setFormShown(event.target.value);
  };

  // Shall pass formShown to forms in order to reset it (or maybe a reset function)
  const resetForm = () => {
    setFormShown("");
  };

  return (
    <div style={{ marginTop: "0.5em" }}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">
          New Entry
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={formShown}
          onChange={handleChange}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"hospital"}>Hospital</MenuItem>
          <MenuItem value={"healthCheck"}>Health Check</MenuItem>
          <MenuItem value={"occupationHealthCheck"}>
            Occupational Health Check
          </MenuItem>
        </Select>
      </FormControl>
      <HospitalEntryForm
        show={formShown === "hospital"}
        resetForm={resetForm}
      ></HospitalEntryForm>
    </div>
  );
};

export default EntryForm;
