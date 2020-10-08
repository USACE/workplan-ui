import React from "react";
import Navbar from "../app-components/navbar";
export default () => (
  <>
  <Navbar />
    <main role="main" class="container">
      <div class="jumbotron">
        <h1>Navbar example</h1>
        <p class="lead">
          This example is a quick exercise to illustrate how the top-aligned
          navbar works. As you scroll, this navbar remains in its original
          position and moves with the rest of the page.
        </p>
        <a
          class="btn btn-lg btn-primary"
          href="/docs/4.3/components/navbar/"
          role="button"
        >
          View navbar docs &raquo;
        </a>
      </div>
    </main>
  </>
);
