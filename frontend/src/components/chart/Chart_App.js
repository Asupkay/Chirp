import io from 'socket.io-client';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chart from './chart';
import { Header } from 'semantic-ui-react';

const styles = theme => ({
  'chart-container': {
    height: 400
  }
});

class App extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes['chart-container']}>
        <Header as="h3" textAlign="center">
          Sentiment Analysis Over Time
        </Header>
        <Chart
          data={this.props.lineChartData}
          options={this.props.lineChartOptions}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
