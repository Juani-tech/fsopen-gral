import { HealthCheckEntry, HealthCheckRating } from "../types";
import Diagnoses from "./Diagnoses";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

const getHealthRatingColor = (rating: HealthCheckRating): string => {
  switch (rating) {
    case HealthCheckRating.Healthy: {
      return "#00ed14";
    }
    case HealthCheckRating.LowRisk: {
      return "#fffb00";
    }
    case HealthCheckRating.HighRisk: {
      return "#ff7b00";
    }
    case HealthCheckRating.CriticalRisk: {
      return "red";
    }
    default: {
      throw new Error("Invalid health rating");
    }
  }
};

const HealthCheckEntryView = ({ entry }: HealthCheckProps) => {
  return (
    <>
      <p>
        {entry.date} {entry.description}
      </p>

      <FavoriteIcon
        style={{ color: getHealthRatingColor(entry.healthCheckRating) }}
      ></FavoriteIcon>
      {entry.diagnosisCodes && (
        <Diagnoses diagnoses={entry.diagnosisCodes}></Diagnoses>
      )}
      <p>Diagnose by {entry.specialist}</p>
    </>
  );
};

export default HealthCheckEntryView;
