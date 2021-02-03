import React, { useState } from "react";
import { connect } from "redux-bundler-react";

const ProjectFundingForm = connect(
  "selectProjectsItemsArray",
  "selectTimeperiodCurrent",
  "doProjectsFundingSave",
  "doModalClose",
  ({
    projectsItemsArray: projects,
    timeperiodCurrent,
    doProjectsFundingSave,
    doModalClose,
    item,
  }) => {
    const [payload, setPayload] = useState(
      (item &&
        item.project &&
        timeperiodCurrent && {
          project_id: item.project.id,
          timeperiod_id: timeperiodCurrent.id,
          total: item.project.funds_remaining || 0,
        }) ||
        {}
    );
    return (
      <div
        className="modal-content"
        style={{ display: "block", overflowY: "visible" }}
      >
        <form
          id="project-form"
          onSubmit={doModalClose}
          style={{ display: "block", overflowY: "visible" }}
        >
          <header className="modal-header">
            <h5 className="modal-title">Update Project Funding</h5>
            <span className="pointer" onClick={doModalClose}>
              <i className="mdi mdi-close-circle-outline"></i>
            </span>
          </header>
          <section className="modal-body" style={{ overflowY: "visible" }}>
            <div className="my-3">
              <span className="h6">Project:</span>
              <span className="h5 ml-2">{item.project.name}</span>
            </div>

            <div className="my-2">
              <span className="h6">Timeperiod Ending:</span>
              <span className="h5 ml-2">
                {timeperiodCurrent.timeperiod_end}
              </span>
            </div>
            <label className="mt-4">Funds Remaining</label>
            <input
              value={payload.funds_remaining}
              onChange={(e) => {
                setPayload({
                  ...payload,
                  total: parseFloat(e.target.value),
                });
              }}
              className="form-control"
              type="number"
              placeholder="$0"
            />
          </section>
          <footer
            className="modal-footer mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex w-100 justify-content-between">
              <div>
                <button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      !payload.project_id ||
                      !payload.timeperiod_id ||
                      !payload.total
                    ) {
                      console.error("Missing Key/Value in payload");
                      return;
                    } else {
                      doProjectsFundingSave(payload);
                    }
                    doModalClose();
                  }}
                >
                  Save
                </button>
                <button type="submit" className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </footer>
        </form>
      </div>
    );
  }
);

export default ProjectFundingForm;
