import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectEmployeesItemsObject",
  "selectEmployeesItemsArray",
  "selectProjectsItemsObject",
  "selectProjectsItemsArray",
  "selectTimeperiodCurrentAndFutureItemsArray",
  "doTimeperiodSetSelectedId",
  "selectTimeperiodSelectedId",
  "doCommitmentsSave",
  "doLeaveSave",
  ({
    employeesItemsObject: employeesObject,
    employeesItemsArray: employees,
    projectsItemsObject: projectsObj,
    projectsItemsArray: projects,
    timeperiodCurrentAndFutureItemsArray: timeperiods,
    doTimeperiodSetSelectedId,
    timeperiodSelectedId,
    doCommitmentsSave,
    doLeaveSave,
  }) => {
    const [employee, setEmployee] = useState("");
    const [project, setProject] = useState("");
    const [days, setDays] = useState(0);
    const [projectDropdownIsOpen, setProjectDropdownIsOpen] = useState(false);

    const toggleProjectDropdownIsOpen = () => {
      setProjectDropdownIsOpen(!projectDropdownIsOpen);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const base_payload = {
        employee_id: employee,
        timeperiod_id: timeperiodSelectedId,
        days: days,
      };
      if (days <= 0) {
        console.log("\n\nCOMMITMENT MUST BE GREATER THAN 0 DAYS\n\n");
        return;
      }
      if (project.toUpperCase() === "LEAVE") {
        console.log(base_payload);
        doLeaveSave(base_payload);
      } else {
        // Add project_id to payload
        doCommitmentsSave({
          ...base_payload,
          project_id: project,
          cost: 0, // Let API calculate cost and update page on fetch
        });
      }
    };

    const initializeForm = () => {
      if (employee === "" && employees && employees.length) {
        setEmployee(employees[0].id);
      }
      if (project === "" && projects && projects.length) {
        setProject("Leave");
      }
      if (!timeperiodSelectedId && timeperiods && timeperiods.length) {
        doTimeperiodSetSelectedId(timeperiods[0].id);
      }
    };
    // On initial render, initialize form without requiring onChange handler.
    // Avoids case where submit form, but did not need to change one of the fields.
    useEffect(initializeForm, [employees, projects, timeperiods]);

    return (
      <form>
        <div className="col">
          <div className="d-flex flex-row align-items-end">
            <div className="mr-2">
              <label>Timeperiod</label>
              <select
                value={timeperiods[timeperiodSelectedId]}
                onChange={(e) => doTimeperiodSetSelectedId(e.target.value)}
                className="custom-select"
                type="number"
              >
                {timeperiods.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mx-2">
              <label>Employee</label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="custom-select"
              >
                {employees.map((e) => (
                  <option key={`employee_option_${e.id}`} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mx-2">
              <label>Days to Commit</label>
              <input
                onChange={(e) => setDays(parseInt(e.target.value))}
                value={days}
                type="number"
                min={1}
                className="form-control"
                placeholder="Days"
                required
              />
            </div>
            <div className="mx-2">
              <div>
                <label>Project</label>
              </div>
              <div class="btn-group">
                <button
                  type="button"
                  className="btn btn-block btn-secondary dropdown-toggle"
                  onClick={(e) => {
                    toggleProjectDropdownIsOpen();
                  }}
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {(project &&
                    projectsObj &&
                    projectsObj[project] &&
                    projectsObj[project].name) ||
                    project}
                </button>
                <div
                  className={`dropdown-menu ${
                    projectDropdownIsOpen ? "show" : ""
                  }`}
                >
                  <span
                    className="dropdown-item cursor-pointer"
                    onClick={(e) => {
                      setProject("Leave");
                      setProjectDropdownIsOpen(false);
                    }}
                  >
                    Leave
                  </span>
                  <div class="dropdown-divider"></div>
                  {projects.map((p) => (
                    <span
                      className="dropdown-item"
                      onClick={(e) => {
                        setProject(p.id);
                        setProjectDropdownIsOpen(false);
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-block btn-info"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
);
