import React from "react";

import { Bar } from "react-chartjs-2";

export default function MyBarChart(props) {
  return <Bar data={props.data} options={props.options} />;
}
