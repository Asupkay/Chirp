import React, { Component } from "react";
import firebase from "firebase";
import Chart from "../chart/Chart_App";
import Pie from "../Pie";
import google from "./Google_logo.png";
import Client from "../NewsFeed/Client";
import "./Dashboard.css"
import logo from "./Twitter.svg";

class Dashboard extends Component {
  
  render() {
    let message;
    let pie, image;

    // Google Logo
    image = <img src={google} width="250" height="100" alt="Google logo"/>;

    //Bitcoin chart
    message = <Chart />;

    //Pie graph
    pie = <Pie />;
    return (
      <div >
        <h2>Welcome to Dashboard!!</h2>
        <table  cellPadding= "50px" width="200px">
          <tr className="App">
            <th><img src={logo} alt="Twitter's logo"/></th>
            <th className="App-logo">{image}</th>
        </tr>
        <tr>
          <td className="App-button">{<button onClick={() => firebase.auth().signOut() }>Sign out</button>}</td>
        </tr>
        </table>

        <table cellPadding= "50px" width= "1400px" height="500px" >
          <tr>
            <th>{message}</th>
            <th><Client /></th> 
        </tr>
        <tr>
          <td>{pie}</td>
        </tr>
        </table>

      </div>
    );
  }
}

export default Dashboard;
