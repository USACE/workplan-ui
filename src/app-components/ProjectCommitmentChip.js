import React from "react";
import Spinner from "./Spinner";
import { classnames } from "../utils";

export default function ProjectCommitmentChip({ commitment }) {
  const pccClass = classnames({
    card: true,
    "bg-secondary": true,
    // "bg-warning": availability.days_available < 0,
    // "bg-info":
    //   availability.days_available > 0 && availability.days_available <= 3,
    // "bg-success": availability.days_available > 3
  });

  return !commitment ? (
    <Spinner />
  ) : (
    <div className={pccClass}>
      <div className="card-body">
        <div className="card-title">
          <h6>{commitment.timeperiod_name}</h6>
        </div>
        <p className="card-text text-center">{commitment.charges}</p>
      </div>
    </div>
  );
}
