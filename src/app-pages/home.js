import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../app-components/navbar";

import CommitmentForm from "../app-components/CommitmentForm";
import ProjectCard from "../app-components/ProjectCard";
import {
  EmployeeAvailabilityTable,
  EmployeeAvailabilityTableKey,
} from "../app-components/EmployeeAvailabilityTable";

const ProjectCards = connect(
  "selectProjectsItemsArray",
  ({ projectsItemsArray: projects }) =>
    projects && projects.length ? (
      <>
        {projects.map((p, idx) =>
          // Do not show leave as a project
          p.name.toUpperCase() === "LEAVE" ? (
            <></>
          ) : (
            <div key={idx} className="col-12 col-sm-6 col-lg-4">
              <ProjectCard project={p} />
            </div>
          )
        )}
      </>
    ) : (
      <></>
    )
);

export default connect(
  "selectAuthIsLoggedIn",
  ({ authIsLoggedIn: isLoggedIn }) => (
    <>
      <Navbar />
      <main role="main">
        <div className="container-fluid">
          {isLoggedIn ? (
            <>
              <div className="row jumbotron">
                <ProjectCards />
              </div>
              <div className="row mb-3">
                <div className="d-flex justify-content-between align-items-end">
                  <CommitmentForm />
                  <EmployeeAvailabilityTableKey />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <small>
                    * Numbers represent days not yet assigned to projects or
                    leave
                  </small>
                  <EmployeeAvailabilityTable />
                </div>
              </div>
            </>
          ) : (
            <div className="row">
              <div className="col col-6 offset-3">
                <h1 className="mt-5 display-4 text-center">
                  Login to Continue
                </h1>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
);
