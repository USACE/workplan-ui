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
  putTemplate: "/projects/:item.id",
  postTemplate: "/projects",
  deleteTemplate: "/projects/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["PROJECTS_FUNDING_SAVE_FINISH"],
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
    selectProjectsCostsFuture: createSelector(
      "selectProjectsCostsByTimeperiod",
      "selectTimeperiodCurrentAndFutureItemsArray",
      (tpc, tt) => {
        if (!tpc) {
          return null;
        }
        // timeperiod ids
        const ii = tt.map((t) => t.id);
        let obj = {};
        Object.keys(tpc).forEach((projectId) => {
          // https://stackoverflow.com/questions/49945237/reduce-object-thought-object-entries
          obj[projectId] = Object.entries(tpc[projectId]).reduce(
            (acc, [k, v]) => {
              // if the timeperiod id we're working on is in the
              // array of timeperiod ids known to be current or future
              // include it in the total; if not, return the current total without adding
              if (ii.indexOf(k) !== -1) {
                return acc + v;
              }
              return acc;
            },
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
          if (obj.hasOwnProperty(c.project_id)) {
            obj[c.project_id][c.timeperiod_id] += c.cost;
          }
        });

        return obj;
      }
    ),
    doProjectsFundingSave: (payload) => ({ dispatch, store }) => {
      dispatch({ type: "PROJECTS_FUNDING_SAVE_START" });
      const apiRoot = store.selectApiRoot();
      const authToken = store.selectAuthTokenRaw();

      const url = `${apiRoot}/projects/${payload.project_id}/funding_reality_check`;

      fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }).then((response) => {
        if (!response.ok) {
          console.error(
            `Failed POST to URL: ${url}; payload: ${JSON.stringify(payload)}`
          );
        }
        dispatch({
          type: "PROJECTS_FUNDING_SAVE_FINISH",
        });
      });
    },
    reduceFurther: (state, { type, payload }) => {
      switch (type) {
        case "PROJECTS_FUNDING_SAVE_START":
        case "PROJECTS_FUNDING_SAVE_FINISH":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    },
  },
});
