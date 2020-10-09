import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectEmployeesItemsObject",
  "selectEmployeesItemsArray",
  "selectProjectsItemsArray",
  "selectTimeperiodItemsArray",
  "doCommitmentsSave",
  ({
    employeesItemsObject: employeesObject,
    employeesItemsArray: employees,
    projectsItemsArray: projects,
    timeperiodItemsArray: timeperiods,
    doCommitmentsSave,
  }) => {
    const [employee, setEmployee] = useState("");
    const [project, setProject] = useState("");
    const [timeperiod, setTimeperiod] = useState("");
    const [days, setDays] = useState(0);

    const handleSubmit = (e) => {
      e.preventDefault();
      const payload = {
        employee_id: employee,
        project_id: project,
        timeperiod_id: timeperiod,
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
      if (timeperiod === "" && timeperiods && timeperiods.length) {
        setTimeperiod(timeperiods[0].id);
      }
    };
    // On initial render, initialize form without requiring onChange handler.
    // Avoids case where submit form, but did not need to change one of the fields.
    useEffect(initializeForm, [employees, projects, timeperiods]);

    return (
      <div>
        <form>
          <div className="row my-2">
            <div className="col">
              <label>Select Employee:</label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="custom-select mb-3"
              >
                {employees.map((e) => (
                  <option key={`employee_option_${e.id}`} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Select Project:</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="custom-select mb-3"
              >
                {projects.map((p) => (
                  <option selected key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Select Timeperiod:</label>
              <select
                value={timeperiod}
                onChange={(e) => setTimeperiod(e.target.value)}
                className="custom-select mb-3"
                type="number"
              >
                {timeperiods.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col">
              <label>Number of Days to Commit</label>
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
            <div className="col">
              <button
                type="button"
                className="btn btn-info"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
);
