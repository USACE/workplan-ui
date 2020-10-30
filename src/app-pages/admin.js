import React, { useState } from "react";
import Navbar from "../app-components/navbar";
import Spinner from "../app-components/Spinner";
import { connect } from "redux-bundler-react";

const DeleteButton = connect(
  "doProjectsDelete",
  "doModalClose",
  "doUpdateUrlWithHomepage",
  "selectRouteParams",
  ({
    doProjectsDelete,
    doModalClose,
    doUpdateUrlWithHomepage,
    routeParams,
    item,
  }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    if (!item || !item.id) return null;

    const handleDelete = () => {
      setIsConfirming(false);
      doProjectsDelete(
        item,
        () => {
          doModalClose();
          doUpdateUrlWithHomepage("/admin");
        },
        true
      );
    };

    return (
      <>
        {isConfirming ? (
          <div className="btn-group">
            <button
              title="Cancel"
              className="btn btn-secondary"
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              Cancel
            </button>
            <button
              title="Confirm"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Confirm
            </button>
          </div>
        ) : (
          <button
            title="Remove from Group"
            onClick={() => {
              setIsConfirming(true);
            }}
            className="btn btn-danger"
          >
            Delete
          </button>
        )}
      </>
    );
  }
);

const ProjectForm = connect(
  "doProjectsSave",
  "doModalClose",
  ({ doProjectsSave, doModalClose, item }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [funding, setFunding] = useState((item && item.funding) || "");
    return (
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <form id="project-form" onSubmit={doModalClose}>
          <header className="modal-header">
            <h5 className="modal-title">Edit Project</h5>
            <span className="pointer" onClick={doModalClose}>
              <i className="mdi mdi-close-circle-outline"></i>
            </span>
          </header>
          <section className="modal-body">
            <div className="form-group">
              <label>Project Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="form-control"
                type="text"
                placeholder="Project Name"
              />
            </div>
            <div className="form-group">
              <label>Funding</label>
              <input
                value={funding}
                onChange={(e) => {
                  setFunding(parseInt(e.target.value));
                }}
                className="form-control"
                type="number"
                placeholder="$0"
              />
            </div>
          </section>
          <footer
            className="modal-footer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex w-100 justify-content-between">
              <div>
                <DeleteButton item={item} />
              </div>
              <div>
                <button type="submit" className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    const obj = {
                      name: name,
                      funding: funding,
                    };
                    console.log(obj);
                    doProjectsSave({
                      ...item,
                      name: name,
                      funding: funding,
                    });
                    doModalClose();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </footer>
        </form>
      </div>
    );
  }
);

const AdminProject = connect(
  "selectProjectsItemsArray",
  "doModalOpen",
  ({ projectsItemsArray: projects, doModalOpen }) =>
    projects && projects.length ? (
      <div>
        <div>
          <ul className="list-group">
            {projects.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={(e) => {
                  doModalOpen(ProjectForm, { item: p });
                }}
              >
                <div className="d-flex justify-content-between">
                  <div className="">{p.name}</div>
                  <div>
                    {p.funding.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </div>
              </button>
            ))}
          </ul>
        </div>
        <div className="mt-3 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={(e) => doModalOpen(ProjectForm)}
          >
            <i className="mdi mdi-plus" />
            New Project
          </button>
        </div>
      </div>
    ) : (
      <Spinner />
    )
);

export default (props) => {
  //
  const navItems = [{ title: "Projects" }, { title: "..." }];
  const [active, setActive] = useState(navItems[0].title);

  const AdminNav = ({ items }) => {
    return (
      <ul className="nav">
        {items.map((item, idx) => (
          <li className="nav-item">
            <span
              className={`pointer h5 nav-link text-uppercase ${
                item.title === active ? " font-underlined text-primary" : ""
              }`}
              onClick={(e) => setActive(item.title)}
            >
              {item.title}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row my-5 justify-content-center">
          <AdminNav items={navItems} />
        </div>
        <div className="row justify-content-center">
          <div className="col-12">
            {active === "Projects" && <AdminProject />}
          </div>
        </div>
      </div>
    </div>
  );
};
