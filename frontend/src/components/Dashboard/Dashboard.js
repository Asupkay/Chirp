import React, { Component } from 'react';
import firebase from 'firebase';
import Chart from '../chart/Chart_App';
import Pie from '../Pie';
import Google from './Google_logo.png';
import Client from '../NewsFeed/Client';
import { withStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import './Dashboard.css';
import { Header, Container, Image } from 'semantic-ui-react';

class Dashboard extends Component {

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
    },
    pie: {
      lang: {},
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#7C3525',
            '#4D7E34',
            '#347E77',
            '#343E7E',
            '#C93351'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#7C3525',
            '#4D7E34',
            '#347E77',
            '#343E7E',
            '#C93351'
          ]
        }
      ]
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

      Object.keys(nLanguages).forEach((key) => {
        let lang = this.state.pie.lang;
        let labels = this.state.pie.labels;
        let data = this.state.pie.data;
        let addNum = nLanguages[key];
        if(lang[key] == null) {
          lang[key] = this.state.labels.length;
          labels.push(key);
          data.push(addNum);
        } else {
          data[lang[key]] += addNum;
        }
        this.setState({pie: { lang: lang, labels, data }});
      });
    });
  }



  render() {
    return (
      <div>
        <Image src={Google} size="small" centered />
        <Container>
          <Chart lineChartData={this.state.lineChartData} lineChartOptions={this.state.lineChartOptions}/>
        </Container>
        <Container>
          <Pie data = {this.state.pie}/>
        </Container>
      </div>
    );
  }
}

export default withStyles(() => {}, { withTheme: true })(Dashboard);
