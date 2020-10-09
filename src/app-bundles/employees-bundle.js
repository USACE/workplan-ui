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
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  urlParamSelectors: [],
  addons: {
    selectEmployeesTimeperiodCommitmentTotals: createSelector(
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
            obj[e.id][t.id] = { committed: 0, available: t.workdays };
          });
        });
        commitments.forEach((c) => {
          obj[c.employee_id][c.timeperiod_id].committed += c.days;
          obj[c.employee_id][c.timeperiod_id].available -= c.days;
        });
        return obj;
      }
    ),
  },
});
