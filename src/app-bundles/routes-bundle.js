import { createRouteBundle } from "redux-bundler";
import Home from "../app-pages/home";
import Logout from "../app-pages/logout";
import NotFound from "../app-pages/404";
import Admin from "../app-pages/admin";

export default createRouteBundle(
  {
    "": Home,
    "/": Home,
    "/admin": Admin,
    "/logout": Logout,
    "*": NotFound,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
