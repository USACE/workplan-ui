import React, { Fragment } from "react";
import { connect } from "redux-bundler-react";
import { classnames } from "../utils";

export const EmployeeAvailabilityTableKey = (props) => (
  <div className="d-flex flex-row">
    <div style={{ width: 20 }} className="bg-secondary" />
    <div className="mx-2">Current Pay Period</div>
    <div style={{ width: 20 }} className="bg-warning ml-4" />
    <div className="mx-2 text-warning font-weight-bold">Editing</div>
  </div>
);

const Snippet = connect(
  "selectProjectsItemsObject",
  "doCommitmentsDelete",
  ({ projectsItemsObject: projectObj, doCommitmentsDelete, item }) => {
    const projects = item.projects;
    return (
      projectObj &&
      Object.keys(projectObj).length && (
        <div>
          {Object.keys(projects).map((p, idx) => (
            <div
              key={idx}
              className="d-flex flex-row justify-content-between align-items-center"
            >
              <i
                className="mdi mdi-delete-forever pr-1"
                onClick={(e) => {
                  doCommitmentsDelete({ id: projects[p].commitment_id });
                }}
              />
              {projectObj[p].name}
              <small>({projects[p].days}days)</small>
            </div>
          ))}
        </div>
      )
    );
  }
);

export const EmployeeAvailabilityTable = connect(
  "selectEmployeesTimeperiodSummary",
  "selectTimeperiodCurrentAndFutureItemsArray",
  "selectEmployeesItemsArray",
  "selectTimeperiodSelected",
  "selectTimeperiodCurrent",
  ({
    employeesTimeperiodSummary: etSummary,
    timeperiodCurrentAndFutureItemsArray: timeperiods,
    employeesItemsArray: employees,
    timeperiodSelected,
    timeperiodCurrent,
  }) => {
    const DaysAvailable = ({ days }) => {
      const daClass = (days) =>
        classnames({
          "py-0 my-0": true,
        });

      return <span className={daClass(days)}>{days}</span>;
    };

    const tpCellClass = (timeperiod) =>
      timeperiod &&
      classnames({
        "text-center": true,
        "font-weight-light": timeperiod.id !== timeperiodSelected.id,
        "text-warning font-weight-bold":
          timeperiod.id === timeperiodSelected.id,
        "bg-secondary": timeperiod.id === timeperiodCurrent.id,
      });

    return (
      timeperiods &&
      timeperiods.length &&
      employees &&
      employees.length &&
      etSummary &&
      Object.keys(etSummary).length && (
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Employee</th>
              {timeperiods.map((t) => (
                <th className={tpCellClass(t)} key={t.id} scope="col">
                  <div>
                    <div>{t.name}</div>
                    <div>
                      <small>{t.workdays}d</small>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e, idx) => (
              <Fragment key={idx}>
                <tr key={`${e.id}-row1`}>
                  <th scope="row">{e.name}</th>
                  {timeperiods.map((t) => (
                    <td
                      key={`${e.id}-${t.id}-hoursavailable`}
                      className={tpCellClass(t)}
                    >
                      {
                        <DaysAvailable
                          days={etSummary[e.id][t.id].workdays_free}
                        />
                      }
                    </td>
                  ))}
                </tr>
                <tr key={`${e.id}-row2`} className="border-top">
                  <td></td>
                  {timeperiods.map((t) => (
                    <td
                      key={`${e.id}-${t.id}-projectpercents`}
                      className={tpCellClass(t)}
                    >
                      <Snippet item={etSummary[e.id][t.id]} />
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      )
    );
  }
);
