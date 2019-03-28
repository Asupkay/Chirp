import React, { Component } from 'react';
import firebase from 'firebase';
import Chart from '../chart/Chart_App';
import Pie from '../Pie';
import Google from './Google_logo.png';
import Client from '../NewsFeed/Client';
import './Dashboard.css';
import { Header, Container, Image } from 'semantic-ui-react';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Image src={Google} size="small" centered />
        <Container>
          <Chart />
        </Container>
        <Container>
          <Pie />
        </Container>
      </div>
    );
  }
}

export default Dashboard;
