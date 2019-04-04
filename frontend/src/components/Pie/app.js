import React from "react";

import PieExample from "./pie";
import "./pie.css";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <PieExample data={this.props.data}/>
      </div>
    );
  }
}
