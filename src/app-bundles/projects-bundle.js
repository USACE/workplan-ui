import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "projects",
  uid: "id",
  prefetch: true,
  staleAfter: 0,
  persist: false,
  sortBy: "name",
  routeParam: "",
  getTemplate: "/projects",
  putTemplate: "/:",
  postTemplate: "/projects",
  deleteTemplate: "/projects/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  urlParamSelectors: [],
  allowRoles: ["PUBLIC.USER"],
  addons: {
    selectProjectsChartData: createSelector(
      "selectProjectsCostsByTimeperiod",
      "selectTimeperiodItemsObject",
      "selectTimeperiodIsLoading",
      (costs, timeperiodObj, isLoading) => {
        if (!costs || isLoading || !Object.keys(timeperiodObj).length) {
          return null;
        }
        let obj = {};
        Object.keys(costs).forEach((projectId) => {
          obj[projectId] = Object.keys(costs[projectId]).map((timeperiodId) => {
            return {
              id: timeperiodId,
              value: costs[projectId][timeperiodId],
              title: timeperiodObj[timeperiodId].name,
            };
          });
        });
        return obj;
      }
    ),
    selectProjectsCostsTotal: createSelector(
      "selectProjectsCostsByTimeperiod",
      (tpc) => {
        if (!tpc) {
          return null;
        }
        let obj = {};
        Object.keys(tpc).forEach((projectId) => {
          obj[projectId] = Object.values(tpc[projectId]).reduce(
            (acc, item) => acc + item,
            0
          );
        });
        return obj;
      }
    ),
    selectProjectsCostsByTimeperiod: createSelector(
      "selectProjectsItemsArray",
      "selectProjectsIsLoading",
      "selectTimeperiodItemsArray",
      "selectTimeperiodIsLoading",
      "selectCommitmentsItemsArray",
      (
        projects,
        projectsIsLoading,
        timeperiods,
        timeperiodIsLoading,
        commitments
      ) => {
        if (
          projectsIsLoading ||
          timeperiodIsLoading ||
          !projects.length ||
          !timeperiods.length
        ) {
          return null;
        }
        // Structure { project_id: { timeperiod_id: $$, timeperiod_id: $$, ...}}
        let obj = {};
        // Initialize object; all totals 0
        projects.forEach((p) => {
          obj[p.id] = {};
          timeperiods.forEach((t) => {
            obj[p.id][t.id] = 0;
          });
        });
        commitments.forEach((c) => {
          obj[c.project_id][c.timeperiod_id] += c.cost;
        });

        return obj;
      }
    ),
  },
});
