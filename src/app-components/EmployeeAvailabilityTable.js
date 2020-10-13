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

export const EmployeeAvailabilityTable = connect(
  "selectEmployeesTimeperiodCommitmentTotals",
  "selectEmployeesTimeperiodProjectPercentages",
  "selectTimeperiodItemsArray",
  "selectEmployeesItemsArray",
  "selectTimeperiodSelected",
  "selectTimeperiodCurrent",
  "selectProjectsItemsObject",
  ({
    employeesTimeperiodCommitmentTotals: ecTotals,
    employeesTimeperiodProjectPercentages: ePercentages,
    timeperiodItemsArray: timeperiods,
    employeesItemsArray: employees,
    timeperiodSelected,
    timeperiodCurrent,
    projectsItemsObject: projectsObj,
  }) => {
    const DaysAvailable = ({ days }) => {
      const daClass = (days) =>
        classnames({
          "py-0 my-0": true,
        });

      return <span className={daClass(days)}>{days}</span>;
    };

    const tpCellClass = (timeperiod) =>
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
      ecTotals &&
      Object.keys(ecTotals).length && (
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Employee</th>
              {timeperiods.map((t) => (
                <th className={tpCellClass(t)} key={t.id} scope="col">
                  {t.name}
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
                      {<DaysAvailable days={ecTotals[e.id][t.id].available} />}
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
                      {Object.entries(ePercentages[e.id][t.id]).map(
                        (keyval, idx) => {
                          return (
                            <div key={idx}>
                              <small>{`${projectsObj[keyval[0]].name}:${
                                keyval[1]
                              }%`}</small>
                            </div>
                          );
                        }
                      )}
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
