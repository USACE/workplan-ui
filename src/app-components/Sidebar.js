import React from "react";

export default function Sidebar() {
  return (
    <div className="c-sidebar c-sidebar-dark c-sidebar-fixed" id="c-sidebar">
      <div className="c-sidebar-brand">Scaffold App</div>
      <ul
        className="c-sidebar-nav ps ps--active-y"
        data-drodpown-accordion="true"
      >
        <li className="c-sidebar-nav-title">Heading</li>
        <li className="c-sidebar-nav-item">
          <a className="c-sidebar-nav-link" href="#">
            Item 1
          </a>
        </li>
        <li className="c-sidebar-nav-item">
          <a className="c-sidebar-nav-link" href="#">
            Item 2
          </a>
        </li>
        <li className="c-sidebar-nav-item">
          <a className="c-sidebar-nav-link" href="#">
            Item 3
          </a>
        </li>
        <li className="c-sidebar-nav-item">
          <a className="c-sidebar-nav-link" href="#">
            Item 4
          </a>
        </li>
        <li className="c-sidebar-nav-item">
          <a className="c-sidebar-nav-link" href="#">
            Item 5
          </a>
        </li>
      </ul>
    </div>
  );
}
