import React from "react";
import { connect } from "redux-bundler-react";

import { BarChart } from "./Charts";
import Spinner from "./Spinner";

import { DateTime } from "luxon";
import EditProjectFundingOnClickWrapper from "./EditProjectFunding/EditProjectFundingButton";

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
  "selectProjectsCostsFuture",
  ({ projectsCostsFuture, project }) =>
    projectsCostsFuture && (
      <div className="c-callout py-0 my-0 py-0 c-callout-secondary">
        <small className="text-muted">Execution</small>
        <br />
        <strong className="p">
          {project &&
            project.funds_remaining &&
            `${(
              (projectsCostsFuture[project.id] / project.funds_remaining) *
              100
            ).toFixed(0)}%`}
        </strong>
      </div>
    )
);

const ForecastedEndOfFYBalance = connect(
  "selectProjectsCostsFuture",
  ({ projectsCostsFuture, project }) =>
    projectsCostsFuture && (
      <div className="c-callout py-0 my-0 py-0 c-callout-secondary">
        <small className="text-muted">Forecast Bal.</small>
        <br />
        <strong className="p">
          {project &&
            project.funds_remaining &&
            (
              project.funds_remaining - projectsCostsFuture[project.id]
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
        </strong>
      </div>
    )
);

const ExpectedChargesFuture = connect(
  "selectProjectsCostsFuture",
  ({ projectsCostsFuture, project }) =>
    projectsCostsFuture && (
      <div className="c-callout py-0 my-0 py-0 c-callout-secondary">
        <small className="text-muted">Now --> FY End</small>
        <br />
        <strong className="p">
          {projectsCostsFuture[project.id].toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </strong>
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

const CardFundingRemainingBlock = ({ project }) => {
  return (
    project && (
      <div>
        <EditProjectFundingOnClickWrapper project={project}>
          {project.funds_remaining ? (
            <>
              <h5 className="text-right mb-0">
                {`$${(project.funds_remaining / 1000).toLocaleString("en-US", {
                  style: "decimal",
                })}K`}
              </h5>
              <p className="text-right text-muted text-small mb-0">
                <small>
                  {`${DateTime.fromISO(
                    project.latest_reality_check
                  ).toRelative()}`}
                </small>
              </p>
            </>
          ) : (
            <>
              <h5 className="text-right mb-0">?</h5>
            </>
          )}
        </EditProjectFundingOnClickWrapper>
      </div>
    )
  );
};

export default ({ project }) => (
  <div className="card">
    <div className="card-header">
      <div className="row justify-content-between">
        <div className="col">
          <h4>{project.name}</h4>
        </div>
        <div className="col-4">
          <CardFundingRemainingBlock project={project} />
        </div>
      </div>
    </div>
    <div className="card-body">
      <div className="row">
        <div className="col">
          <ExpectedCharges projectId={project.id} />
        </div>
        <div className="col">
          <ExpectedChargesFuture project={project} />
        </div>

        <div className="col">
          <ForecastedEndOfFYBalance project={project} />
        </div>
        <div className="col">
          <ExpectedExecution project={project} />
        </div>
      </div>
      <MyBarChart project={project} />
    </div>
  </div>
);
