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
        {projects.map((p, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-lg-4">
            <ProjectCard project={p} />
          </div>
        ))}
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
                  <EmployeeAvailabilityTable />
                </div>
              </div>
            </>
          ) : (
            <h1>Login to Continue</h1>
          )}
        </div>
      </main>
    </>
  )
);
