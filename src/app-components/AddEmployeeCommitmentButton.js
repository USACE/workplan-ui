import React from "react";

export default function AddEmployeeCommitmentButton(props) {
  return (
    <button
      type="button"
      className="btn btn-pill btn-info"
      onClick={props.onClick}
    >
      <small>+ Commitment</small>
    </button>
  );
}
