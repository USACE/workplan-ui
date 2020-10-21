import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from "redux-bundler";
import createNestedUrlBundle from "./create-nested-url-bundle";
import createAuthBundle from "./create-auth-bundle";
// Required change from @corpsmap/create-jwt-api-bundle;
import createJwtApiBundle from "./create-jwt-api-bundle";
import routesBundle from "./routes-bundle";
import modalBundle from "./modal-bundle";
import cache from "../cache";
import pkg from "../../package.json";

import commitmentsBundle from "./commitments-bundle";
import employeesBundle from "./employees-bundle";
import projectsBundle from "./projects-bundle";
import timeperiodBundle from "./timeperiod-bundle";

// In House Labor
// Travel/BuyingStuff
// Contract

console.log(process.env.NODE_ENV);
export default composeBundles(
  createAuthBundle({
    appId: "ef720041-d710-4b27-99d6-1638611b97d5",
    redirectOnLogout: pkg.homepage,
    mock: process.env.NODE_ENV === "development" ? true : false,
    token:
      process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwibmFtZSI6IlVzZXIuVGVzdCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwLCJyb2xlcyI6WyJQVUJMSUMuVVNFUiJdfQ.Igbrcn-3Sk-bysuvCUgX5gFW5AuDfPidswIsZg4Oaos"
        : null,
  }),
  createJwtApiBundle({
    root:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3030/workplan`
        : `https://api.rsgis.dev/development/workplan`,
    tokenSelector: "selectAuthTokenRaw",
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
  modalBundle,
  commitmentsBundle,
  employeesBundle,
  projectsBundle,
  timeperiodBundle
);
