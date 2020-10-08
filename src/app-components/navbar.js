import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";
import { classnames } from "../utils";

const getInitials = (name) => {
  let initials = ["U", "N"];
  let parts = name.split(".");
  if (parts[1] && parts[1][0]) initials[0] = parts[1][0];
  if (parts[0] && parts[0][0]) initials[1] = parts[0][0];
  return initials.join("");
};

const ProfileMenu = connect(
  "selectAuthTokenPayload",
  ({ authTokenPayload: user }) => {
    const [show, setShow] = useState(false);
    const expand = () => {
      if (!show) setShow(true);
    };
    const collapse = () => {
      setShow(false);
    };
    useEffect(() => {
      if (show) {
        window.addEventListener("click", collapse);
      }
      return () => {
        window.removeEventListener("click", collapse);
      };
    }, [show]);
    return (
      <li
        className={`nav-item dropdown ${show ? "show" : ""}`}
        title={`Currently logged in as ${user.name}`}
        onClick={expand}
      >
        <span
          style={{ border: "2px solid green", borderRadius: "2em" }}
          className="nav-link ml-2"
          id="navbarDropdownMenuLink"
          role="button"
          aria-haspopup="true"
          aria-expanded={show}
        >
          {`${getInitials(user.name)}`}
        </span>
        <div
          className={`dropdown-menu dropdown-menu-right ${show ? "show" : ""} `}
          aria-labelledby="navbarDropdownMenuLink"
        >
          <a className="dropdown-item" href="/logout">
            <div>
              <strong>Logout</strong>
            </div>
            <div>
              <small className="text-muted">{`Currently logged in as ${user.name}`}</small>
            </div>
          </a>
          {/* 
            Create link to user profile (this will contain *user favorited projects*,  notifications, tbc.)
          
            <a>
              My Profile
            </a>
          */}
        </div>
      </li>
    );
  }
);

const NavItem = connect(
  "selectPathname",
  ({ pathname, href, handler, children, hidden }) => {
    if (hidden) return null;
    const handleClick = (e) => {
      if (handler && typeof handler === "function") handler(e);
    };
    const cls = classnames({
      pointer: true,
      "nav-item": true,
      active: pathname.indexOf(href) !== -1,
    });
    if (href) {
      return (
        <li className={cls}>
          <a className="nav-link" href={href}>
            {children}
          </a>
        </li>
      );
    }
    if (handler) {
      return (
        <li className={cls} onClick={handleClick}>
          <span className="nav-link">{children}</span>
        </li>
      );
    }
  }
);

export default connect(
  "doAuthLogin",
  "selectAuthIsLoggedIn",
  ({ doAuthLogin, authIsLoggedIn }) => (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <span className="navbar-brand">
        APP_NAME
      </span>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto"></ul>
          <ul className="navbar-nav">
            {authIsLoggedIn ? (
              <ProfileMenu />
            ) : (
              <NavItem handler={doAuthLogin}>Login</NavItem>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
);
