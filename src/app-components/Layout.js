import React from "react";

import Sidebar from "./Sidebar";

export default function Layout(props) {
  return (
    <>
      <Sidebar />
      <div className="c-wrapper">
        <header className="c-header"></header>
        <div className="c-body">
          <main className="c-main">
            <div className="container-fluid">{props.children}</div>
          </main>
        </div>
        <footer className="c-footer"></footer>
      </div>
    </>
  );
}
