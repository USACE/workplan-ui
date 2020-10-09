import React from "react";
import { connect } from "redux-bundler-react";

import { BarChart } from "./Charts";
import Spinner from "./Spinner";

const ExpectedCharges = connect(
  "selectProjectsCostsTotal",
  ({ projectsCostsTotal, projectId }) =>
    !projectsCostsTotal ? (
      ""
    ) : (
      <div className="c-callout py-0 my-0 py-0 c-callout-secondary">
        <small className="text-muted">Exp. Charges</small>
        <br />
        <strong className="p">
          {projectsCostsTotal[projectId].toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </strong>
      </div>
    )
);

const ExpectedExecution = connect(
  "selectProjectsCostsTotal",
  ({ projectsCostsTotal, project }) =>
    !projectsCostsTotal ? (
      ""
    ) : (
      <div className="c-callout py-0 my-0 py-0 c-callout-secondary">
        <small className="text-muted">Execution</small>
        <br />
        <strong className="p">{`${(
          (projectsCostsTotal[project.id] / project.funding) *
          100
        ).toFixed(0)}%`}</strong>
      </div>
    )
);

const ChartOptions = {
  title: {
    display: true,
    text: "Charges by Timeperiod",
  },
  scales: {
    yAxes: [
      {
        ticks: {
          min: 0,
          max: 30000,
          stepSize: 10000,
          callback: (value, index, values) => `$${value / 1000}K`,
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      label: (tooltipItem, data) => {
        // https://www.chartjs.org/docs/latest/configuration/tooltip.html#label-callback
        let label = data.datasets[tooltipItem.datasetIndex].label || "";

        if (label) {
          label += ": ";
        }
        label += tooltipItem.yLabel.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        return label;
      },
    },
  },
};

const MyBarChart = connect(
  "selectProjectsChartData",
  ({ projectsChartData, project }) => {
    const data =
      !projectsChartData || !project
        ? null
        : {
            labels: projectsChartData[project.id].map((d) => d.title),
            datasets: [
              {
                label: "forecast",
                barPercentage: 0.9,
                backgroundColor: "rgba(44,162,95, 0.5)",
                data: projectsChartData[project.id].map((c) => c.value),
              },
            ],
          };
    return !data ? (
      <Spinner />
    ) : (
      <BarChart data={data} options={ChartOptions} />
    );
  }
);

export default ({ project }) => (
  <div className="card">
    <div className="card-header">
      <div className="row justify-content-between">
        <div className="col">
          <h4>{project.name}</h4>
        </div>
        <div className="col-4">
          <h5 className="text-right">
            {`$${(project.funding / 1000).toLocaleString("en-US", {
              style: "decimal",
            })}K`}
          </h5>
        </div>
      </div>
    </div>
    <div className="card-body">
      <div className="row">
        <div className="col">
          <div className="c-callout py-0 my-0 py-0 c-callout-secondary">
            <small className="text-muted">$ Received</small>
            <br />
            <strong className="p">0</strong>
          </div>
        </div>
        <div className="col">
          <ExpectedCharges projectId={project.id} />
        </div>
        <div className="col">
          <ExpectedExecution project={project} />
        </div>
      </div>
      <MyBarChart project={project} />
    </div>
  </div>
);
