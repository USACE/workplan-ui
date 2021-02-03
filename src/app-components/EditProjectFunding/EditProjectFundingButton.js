import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import EditProjectFundingForm from "./EditProjectFundingModal";

const EditProjectFundingOnClickWrapper = connect(
  "doModalOpen",
  ({ doModalOpen, project, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          doModalOpen(
            EditProjectFundingForm,
            {
              item: { project: project },
            },
            "lg"
          );
        }}
      >
        {isHovered && (
          <div
            className="p-1 bg-secondary text-white rounded"
            style={{ position: "absolute", top: "-40px", right: "-40px" }}
          >
            update funding
          </div>
        )}
        {children}
      </div>
    );
  }
);

export default EditProjectFundingOnClickWrapper;
