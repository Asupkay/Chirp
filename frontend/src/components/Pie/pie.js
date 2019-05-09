import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import './pie.css';
import { Header, Container, Image } from 'semantic-ui-react';

class Pie1 extends Component {
  render() {
    return (
      <div>
        <Header as="h3" textAlign="center">
          Language Analysis Over Time
        </Header>
        <Pie data={this.props.data} />
      </div>
    );
  }
}
export default Pie1;
