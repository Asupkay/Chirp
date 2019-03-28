import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import "./pie.css";

const data = {
  labels: [
    "English",
    "Spanish",
    "French",
    "German",
    "Korean",
    "Hindi",
    "Tamil",
    "Gujarat"
  ],
  datasets: [
    {
      data: [15, 30, 20, 5, 5, 5, 10, 10],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#7C3525",
        "#4D7E34",
        "#347E77",
        "#343E7E",
        "#C93351"
      ],
      hoverBackgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#7C3525",
        "#4D7E34",
        "#347E77",
        "#343E7E",
        "#C93351"
      ]
    }
  ]
};

class Pie1 extends Component {

  //	displayName: 'PieExample'
  render() {
    return (
      <div>
        <h2>Language Distribution (Twitter Feeds)</h2>
        <Pie data={data} />
      </div>
    );
  }
}
export default Pie1;
