import { createSelector } from "redux-bundler";
import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "timeperiod",
  uid: "id",
  prefetch: true,
  staleAfter: 0,
  persist: false,
  sortBy: "",
  routeParam: "",
  getTemplate: "/timeperiods",
  putTemplate: "/:",
  postTemplate: "/timeperiods",
  deleteTemplate: "/timeperiods/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  urlParamSelectors: [],
  allowRoles: ["PUBLIC.USER"],
  addons: {
    doTimeperiodSetSelectedId: (id) => ({ dispatch, store }) => {
      dispatch({
        type: "TIMEPERIOD_SELECTED",
        payload: { _selectedId: id },
      });
    },
    selectTimeperiodSelectedId: (state) => state.timeperiod._selectedId,
    selectTimeperiodSelected: createSelector(
      "selectTimeperiodSelectedId",
      "selectTimeperiodItemsObject",
      (selectedId, itemsObject) => itemsObject[selectedId]
    ),
    selectTimeperiodCurrentAndFutureItemsArray: createSelector(
      "selectTimeperiodItemsArray",
      (timeperiods) => {
        const now = new Date();
        const tt = timeperiods.filter((t) => {
          return now < new Date(t.timeperiod_end);
        });
        return tt;
      }
    ),
    selectTimeperiodCurrent: createSelector(
      "selectTimeperiodCurrentAndFutureItemsArray",
      (tt) => tt[0]
    ),
  },
  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case "TIMEPERIOD_SELECTED":
        return Object.assign({}, state, payload);
      default:
        return state;
    }
  },
});
