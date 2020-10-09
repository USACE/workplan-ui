import React from "react";
import Spinner from "./Spinner";
import { classnames } from "../utils";

export default function AvailabilityChip({ availability }) {
  const availabilitychipClass = classnames({
    card: true,
    "bg-secondary": availability.days_available == 0,
    "bg-warning": availability.days_available < 0,
    "bg-info":
      availability.days_available > 0 && availability.days_available <= 3,
    "bg-success": availability.days_available > 3,
  });

  return !availability ? (
    <Spinner />
  ) : (
    <div className={availabilitychipClass}>
      <div className="card-body">
        <div className="card-title">
          <h6>{availability.timeperiod_name}</h6>
        </div>
        <p className="card-text text-center">{`Free: ${availability.days_available}`}</p>
      </div>
    </div>
  );
}
