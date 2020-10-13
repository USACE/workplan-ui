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
  },
});
