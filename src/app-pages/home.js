import React from "react";
import { connect } from "redux-bundler-react";
import Navbar from "../app-components/navbar";

import CommitmentForm from "../app-components/CommitmentForm";
import ProjectCard from "../app-components/ProjectCard";
import EmployeeAvailabilityTable from "../app-components/EmployeeAvailabilityTable";

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

export default () => (
  <>
    <Navbar />
    <main role="main">
      <div className="container-fluid">
        <div className="row jumbotron">
          <ProjectCards />
        </div>
        <div className="row">
          <div className="col-12">
            <p className="h4">Employees</p>
          </div>
        </div>
        <CommitmentForm />
        <div className="row">
          <div className="col">
            <EmployeeAvailabilityTable />
          </div>
        </div>
      </div>
    </main>
  </>
);
