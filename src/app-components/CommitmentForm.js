import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectEmployeesItemsObject",
  "selectEmployeesItemsArray",
  "selectProjectsItemsArray",
  "selectTimeperiodCurrentAndFutureItemsArray",
  "doTimeperiodSetSelectedId",
  "selectTimeperiodSelectedId",
  "doCommitmentsSave",
  ({
    employeesItemsObject: employeesObject,
    employeesItemsArray: employees,
    projectsItemsArray: projects,
    timeperiodCurrentAndFutureItemsArray: timeperiods,
    doTimeperiodSetSelectedId,
    timeperiodSelectedId,
    doCommitmentsSave,
  }) => {
    const [employee, setEmployee] = useState("");
    const [project, setProject] = useState("");
    const [days, setDays] = useState(0);

    const handleSubmit = (e) => {
      e.preventDefault();
      const payload = {
        employee_id: employee,
        project_id: project,
        timeperiod_id: timeperiodSelectedId,
        days: days,
        cost: employeesObject[employee].rate * 8 * days,
      };
      console.log(payload);
      doCommitmentsSave(payload);
    };

    const initializeForm = () => {
      if (employee === "" && employees && employees.length) {
        setEmployee(employees[0].id);
      }
      if (project === "" && projects && projects.length) {
        setProject(projects[0].id);
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
              <label>Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="custom-select"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
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
            <div className="ml-2">
              <button
                type="button"
                className="btn btn-info"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
);
