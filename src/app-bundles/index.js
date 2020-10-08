import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from "redux-bundler";
import createNestedUrlBundle from "./create-nested-url-bundle";
import createAuthBundle from "./create-auth-bundle";
// Required change from @corpsmap/create-jwt-api-bundle;
import createJwtApiBundle from "./create-jwt-api-bundle";
import routesBundle from './routes-bundle';
import modalBundle from './modal-bundle'
import cache from "../cache";
import pkg from "../../package.json";

export default composeBundles(
  createAuthBundle({
    appId: "APP_ID_HERE",
    redirectOnLogout: pkg.homepage,
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwibmFtZSI6IlRlc3QuVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.D_66UceE82DkXwKcpzj0cxl126jAaev_FSGPCDzhRys",
  }),
  createJwtApiBundle({
    root:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3030/APP_NAME_HERE`
        : `https://api.rsgis.dev/development/APP_NAME_HERE`,
    tokenSelector:
      process.env.NODE_ENV === "development"
        ? "selectProfileMockToken"
        : "selectAuthToken",
    unless: {
      // GET requests do not include token unless path starts with /my_
      // Need token to figure out who "me" is
      custom: ({ method, path }) => {
        if (method === "GET") {
          if (path.slice(0, 4) === "/my_") {
            return false;
          }
          return true;
        }
        return false;
      },
    },
  }),
  createCacheBundle({
    cacheFn: cache.set,
  }),
  createUrlBundle(),
  createNestedUrlBundle({
    pkg: pkg,
  }),
  routesBundle,
  modalBundle
);
