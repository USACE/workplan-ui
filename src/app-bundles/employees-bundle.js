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
    selectEmployeesTimeperiodProjectBreakdown: createSelector(
      "selectEmployeesTimeperiodCommittedDaysByProject",
      "selectTimeperiodItemsObject",
      (tbp, timeperiodItemsObj) => {
        if (
          Object.keys(tbp).length === 0 ||
          !timeperiodItemsObj ||
          Object.keys(timeperiodItemsObj).length === 0
        ) {
          return {};
        }
        let obj = {};
        Object.keys(tbp).forEach((employee_id) => {
          obj[employee_id] = {};
          Object.keys(tbp[employee_id]).forEach((timeperiod_id) => {
            obj[employee_id][timeperiod_id] = {};
            // If commitments for employee in timeperiod...
            if (Object.keys(tbp[employee_id][timeperiod_id]).length) {
              Object.keys(tbp[employee_id][timeperiod_id]).forEach(
                (project_id) => {
                  obj[employee_id][timeperiod_id][project_id] = parseInt(
                    (tbp[employee_id][timeperiod_id][project_id] /
                      timeperiodItemsObj[timeperiod_id].workdays) *
                      100
                  );
                }
              );
            }
          });
        });
        return obj;
      }
    ),
    selectEmployeesTimeperiodSummary: createSelector(
      "selectEmployeesItemsArray",
      "selectCommitmentsItemsArray",
      "selectTimeperiodItemsObject",
      "selectEmployeesIsLoading",
      "selectTimeperiodIsLoading",
      (
        employees,
        commitments,
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
              projects: {},
            };
          });
        });
        commitments.forEach((c) => {
          // Add to employee's projects for timeperiod
          obj[c.employee_id][c.timeperiod_id]["projects"][c.project_id] = {
            days: c.days,
            percent: parseInt(
              (c.days * 100) / timeperiodObj[c.timeperiod_id].workdays
            ),
          };
          // Adjust workdays_free for employee timeperiod
          obj[c.employee_id][c.timeperiod_id].workdays_free -= c.days;
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
    selectEmployeesTimeperiodCommitmentTotals: createSelector(
      "selectEmployeesTimeperiodCommittedDaysByProject",
      "selectTimeperiodItemsObject",
      (tbp, timeperiodItemsObj) => {
        if (
          Object.keys(tbp).length === 0 ||
          !timeperiodItemsObj ||
          Object.keys(timeperiodItemsObj).length === 0
        ) {
          return {};
        }
        let obj = {};
        Object.keys(tbp).forEach((employee_id) => {
          obj[employee_id] = {};
          Object.keys(tbp[employee_id]).forEach((timeperiod_id) => {
            obj[employee_id][timeperiod_id] = {
              available: timeperiodItemsObj[timeperiod_id].workdays,
              committed: 0,
            };
            // If commitments for employee in timeperiod...
            if (Object.keys(tbp[employee_id][timeperiod_id]).length) {
              Object.keys(tbp[employee_id][timeperiod_id]).forEach(
                (project_id) => {
                  obj[employee_id][timeperiod_id].committed +=
                    tbp[employee_id][timeperiod_id][project_id];
                  obj[employee_id][timeperiod_id].available -=
                    tbp[employee_id][timeperiod_id][project_id];
                }
              );
            }
          });
        });
        return obj;
      }
    ),
  },
});
