import React from "react";
import { connect } from "redux-bundler-react";
import { classnames } from "../utils";

export default connect(
  "selectEmployeesTimeperiodCommitmentTotals",
  "selectTimeperiodItemsArray",
  "selectEmployeesItemsArray",
  ({
    employeesTimeperiodCommitmentTotals: ecTotals,
    timeperiodItemsArray: timeperiods,
    employeesItemsArray: employees,
  }) => {
    const DaysAvailable = ({ days }) => {
      const daClass = (days) =>
        classnames({
          "c-callout py-0 my-0": true,
          "py-0": true,
          "badge badge-warning": days < 0,
          "text-secondary": days >= 0 && days < 5,
          "badge badge-primary": days > 5,
        });

      return <span className={daClass(days)}>{days}</span>;
    };

    return (
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Employee</th>
            {timeperiods.map((t) => (
              <th key={t.id} scope="col">
                {t.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <th scope="row">{e.name}</th>
              {timeperiods.map((t) => (
                <td key={`${e.id}-${t.id}`}>
                  {<DaysAvailable days={ecTotals[e.id][t.id].available} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);
