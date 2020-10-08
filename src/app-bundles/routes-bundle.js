import { createRouteBundle } from "redux-bundler";
import Home from "../app-pages/home";
import Logout from "../app-pages/logout";
import NotFound from "../app-pages/404";

export default createRouteBundle(
  {
    "": Home,
    "/": Home,
    "/logout": Logout,
    "*": NotFound,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
