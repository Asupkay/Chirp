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
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "Sentiment",
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: '2',
          lineTension: 0.45,
          data: []
        }
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        ]
      }
    }
  };

  componentDidMount() {

    let socket = io.connect();
    socket.on('connect', () => {
      socket.emit('room', 'Google');
    });

    socket.on('initial sentiment', (sentiment) => {
      console.log(sentiment);

      /*let sentiments = [];
      let timeLabels = [];
      for(let i = 0; i < sentiment.length; i++) {
        sentiments.push(sentiment[i].averageSentiment);
      }

      const chartData = {
        ...this.state.lineChartData,
        datasets: [sentiments]
        la
      }*/
    });

    socket.on('initial language count', (languages) => {
      console.log(languages);
    });
  
    socket.on('new sentiment', (nSentiment) => {
      console.log(nSentiment);
      
      const { time, averageSentiment } = nSentiment;
      const oldData = this.state.lineChartData.datasets[0];
      const newData = { ...oldData };
      newData.data.push(averageSentiment);
      
      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newData],
        labels: this.state.lineChartData.labels.concat(
          time
        )
      }
      
      this.setState({ lineChartData: newChartData });
    });

    socket.on('new language nums', (nLanguages) => {
      console.log(nLanguages);
    });
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes['chart-container']}>
        <Header as="h3" textAlign="center">
          Sentiment Analysis Over Time
        </Header>
        <Chart
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
