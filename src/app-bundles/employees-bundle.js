import { createSelector } from "redux-bundler";
import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "employees",
  uid: "id",
  prefetch: true,
  staleAfter: 0,
  persist: false,
  sortBy: "name",
  routeParam: "",
  getTemplate: "/employees",
  putTemplate: "/:",
  postTemplate: "/employees",
  deleteTemplate: "/employees/:item.id",
  fetchActions: ["AUTH_LOGGED_IN"],
  forceFetchActions: [],
  urlParamSelectors: [],
  allowRoles: ["PUBLIC.USER"],
  addons: {
    selectEmployeesTimeperiodSummary: createSelector(
      "selectEmployeesItemsArray",
      "selectCommitmentsItemsArray",
      "selectLeaveItemsArray",
      "selectTimeperiodItemsObject",
      "selectEmployeesIsLoading",
      "selectTimeperiodIsLoading",
      (
        employees,
        commitments,
        leave,
        timeperiodObj,
        employeesIsLoading,
        timeperiodIsLoading
      ) => {
        if (
          employeesIsLoading ||
          timeperiodIsLoading ||
          !employees.length ||
          !timeperiodObj ||
          !Object.keys(timeperiodObj).length
        ) {
          return {};
        }
        let obj = {};
        // Object key is employee
        employees.forEach((e) => {
          obj[e.id] = {};
          Object.values(timeperiodObj).forEach((t) => {
            obj[e.id][t.id] = {
              workdays_total: t.workdays,
              workdays_free: t.workdays, // Compute later...
              leavedays: 0,
              projects: {},
            };
          });
        });
        // Account for Labor Commitments
        commitments.forEach((c) => {
          // Add to employee's projects for timeperiod
          obj[c.employee_id][c.timeperiod_id]["projects"][c.project_id] = {
            commitment_id: c.id,
            days: c.days,
            percent: parseInt(
              (c.days * 100) / timeperiodObj[c.timeperiod_id].workdays
            ),
          };
          // Adjust workdays_free for employee timeperiod
          obj[c.employee_id][c.timeperiod_id].workdays_free -= c.days;
        });
        // Account for Leave
        leave.forEach((l) => {
          obj[l.employee_id][l.timeperiod_id].workdays_free -= l.days;
          obj[l.employee_id][l.timeperiod_id].leavedays += l.days;
        });
        return obj;
      }
    ),
    selectEmployeesTimeperiodCommittedDaysByProject: createSelector(
      "selectEmployeesItemsArray",
      "selectCommitmentsItemsArray",
      "selectTimeperiodItemsArray",
      "selectEmployeesIsLoading",
      "selectTimeperiodIsLoading",
      (
        employees,
        commitments,
        timeperiods,
        employeesIsLoading,
        timeperiodIsLoading
      ) => {
        if (
          employeesIsLoading ||
          timeperiodIsLoading ||
          !employees.length ||
          !timeperiods.length
        ) {
          return {};
        }
        let obj = {};
        // Object key is employee
        employees.forEach((e) => {
          obj[e.id] = {};
          timeperiods.forEach((t) => {
            obj[e.id][t.id] = {};
          });
        });
        commitments.forEach((c) => {
          if (
            !obj[c.employee_id][c.timeperiod_id].hasOwnProperty(c.project_id)
          ) {
            obj[c.employee_id][c.timeperiod_id][c.project_id] = c.days;
          } else {
            obj[c.employee_id][c.timeperiod_id][c.project_id] += c.days;
          }
        });
        return obj;
      }
    ),
  },
});
