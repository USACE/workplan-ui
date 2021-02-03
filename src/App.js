import React from "react";
import { connect } from "redux-bundler-react";
import Modal from "./app-components/modal";
// import AlertNotification from "./app-components/alert-notification";

import "./css/bootstrap/css/bootstrap.min.css";
import "./css/mdi/css/materialdesignicons.min.css";
import "./css/ms/css/mapskin.min.css";

export default connect("selectRoute", ({ route: Route }) => {
  return (
    <div>
      <Route />
      <Modal />
      {/* <AlertNotification /> Removing this until profile is completed. */}
    </div>
  );
});
