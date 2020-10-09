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
  addons: {},
});
