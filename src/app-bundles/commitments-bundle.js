import { createSelector } from "redux-bundler";
import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "commitments",
  uid: "id",
  prefetch: true,
  staleAfter: 0,
  persist: false,
  sortBy: "name",
  routeParam: "",
  getTemplate: "/commitments",
  putTemplate: ":/",
  postTemplate: "/commitments",
  deleteTemplate: "/commitments/:item.id",
  fetchActions: ["AUTH_LOGGED_IN", "AUTH_VERIFY_TOKEN"],
  forceFetchActions: [],
  urlParamSelectors: [],
  allowRoles: ["PUBLIC.USER"],
  addons: {
    selectCommitmentsByEmployeeId: createSelector(
      "selectCommitmentsItemsArray",
      (commitments) => {
        let obj = {};
        commitments.forEach((c) => {
          if (obj.hasOwnProperty(c.employee_id)) {
            obj[c.employee_id].push(c);
          } else {
            obj[c.employee_id] = [c];
          }
        });
        return obj;
      }
    ),
    selectCommitmentsByProjectId: createSelector(
      "selectCommitmentsItemsArray",
      (commitments) => {
        let obj = {};
        commitments.forEach((c) => {
          if (obj.hasOwnProperty(c.project_id)) {
            obj[c.project_id].push(c);
          } else {
            obj[c.project_id] = [c];
          }
        });
        return obj;
      }
    ),
    doCommitmentsDeleteByEmployeeIdProjectIdTimeperiodId: ({
      employeeId,
      projectId,
      timeperiodId,
    }) => ({ store }) => {
      const cc = store.selectCommitmentsItemsArray();
      const deleteCommitments = cc.filter(
        (c) =>
          c.employee_id === employeeId &&
          c.project_id === projectId &&
          c.timeperiod_id === timeperiodId
      );
      // Typically only 1 commitment to delete;
      // If it's typical to bulk-delete these, may be best to send an array
      // of commitmentIds to delete with a single HTTP Call (not calling URLs in a loop)
      deleteCommitments.forEach((c) => store.doCommitmentsDelete(c));
    },
  },
});
