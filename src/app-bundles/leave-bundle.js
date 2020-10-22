import { createSelector } from "redux-bundler";
import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "leave",
  uid: "id",
  prefetch: true,
  staleAfter: 0,
  persist: false,
  sortBy: "name",
  routeParam: "",
  getTemplate: "/leave",
  putTemplate: ":/",
  postTemplate: "/leave",
  deleteTemplate: "/leave/:item.id",
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
  },
});
