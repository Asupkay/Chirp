import React, { Component } from 'react';
import firebase from 'firebase';
import Chart from '../chart/Chart_App';
import Pie from '../Pie';
import Google from './Google_logo.png';
import Facebook from './facebook.svg';
import Client from '../NewsFeed/Client';
import { withStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import './Dashboard.css';
import { Grid, Header, Container, Image, Button } from 'semantic-ui-react';



class Dashboard extends Component {
  state = {
    room: 'Google',
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: 'line',
          label: 'Sentiment',
          backgroundColor: 'rgba(0, 0, 0, 0)',
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
    },
    socket: io.connect(),
  };

  changeRoom = async (company) => {
    let oldRoom = this.state.room;
    await this.setState({
      room: company
    });

    let socket = this.state.socket;
    socket.emit('changeRoom', {oldRoom, newRoom: company});

    console.log(this.state);
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let socket = this.state.socket;
    socket.on('connect', () => {
      socket.emit('room', this.state.room);
    });

    
    socket.on('initial sentiment', sentiment => {
      console.log("HERE");
      let oldSentiment = this.state.lineChartData.datasets[0];
      let sentiments = { ...oldSentiment };
      sentiments.data = [];
      let timeLabels = [];

      for (let timestamp in sentiment) {
        if (sentiment.hasOwnProperty(timestamp)) {
          sentiments.data.push(sentiment[timestamp].averageSentiment);
          const date = new Date(parseInt(timestamp));
          const formattedTime = date.toLocaleTimeString('en-US');
          timeLabels.push(formattedTime);
        }
      }

      const chartData = {
        ...this.state.lineChartData,
        datasets: [sentiments],
        labels: timeLabels
      };

      this.setState({ lineChartData: chartData });
    });

    socket.on('initial language count', languages => {
      let backgroundColor = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#7C3525',
        '#4D7E34',
        '#347E77',
        '#343E7E',
        '#C93351'
      ];
      let hoverBackgroundColor = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#7C3525',
        '#4D7E34',
        '#347E77',
        '#343E7E',
        '#C93351'
      ];
      let lang = {};
      let labels = [];
      let data = [];
      Object.keys(languages).forEach(key => {
        let langCount = languages[key].count;
        lang[key] = labels.length;
        labels.push(key);
        data.push(langCount);
      });
      this.setState({
        pie: {
          lang,
          labels,
          datasets: [{ data, backgroundColor, hoverBackgroundColor }]
        }
      });
    });

    socket.on('new sentiment', nSentiment => {
      console.log(nSentiment);

      const { time, averageSentiment } = nSentiment;
      const oldData = this.state.lineChartData.datasets[0];
      const newData = { ...oldData };
      newData.data.push(averageSentiment);

      let date = new Date(time);
      let formattedTime = date.toLocaleTimeString('en-US');

      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newData],
        labels: this.state.lineChartData.labels.concat(formattedTime)
      };

      this.setState({ lineChartData: newChartData });
    });

    socket.on('new language nums', nLanguages => {
      console.log(nLanguages);

      Object.keys(nLanguages).forEach(key => {
        let lang = this.state.pie.lang;
        let labels = this.state.pie.labels.slice();
        console.log(this.state.pie);
        let data = this.state.pie.datasets[0].data.slice();
        let addNum = nLanguages[key];
        let backgroundColor = [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#7C3525',
          '#4D7E34',
          '#347E77',
          '#343E7E',
          '#C93351'
        ];
        let hoverBackgroundColor = [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#7C3525',
          '#4D7E34',
          '#347E77',
          '#343E7E',
          '#C93351'
        ];
        if (lang[key] == null) {
          lang[key] = labels.length;
          labels.push(key);
          data.push(addNum);
        } else {
          data[lang[key]] += addNum;
        }
        this.setState({
          pie: {
            lang,
            labels,
            datasets: [{ data, backgroundColor, hoverBackgroundColor }]
          }
        });
      });
    });
  }

  

  render() {
    return (
      <div>
        <Grid>
          <Grid.Column textAlign="center">
            <Button.Group>
              <Button color='violet' onClick={() => this.changeRoom('Google')}><Image src={Google} size="tiny"/></Button>
              <Button.Or />
              <Button color='blue' onClick={() => this.changeRoom('Facebook')}><Image src={Facebook} size="tiny"/></Button>
            </Button.Group>
          </Grid.Column>
        </Grid>
        <Container>
          <Chart
            lineChartData={this.state.lineChartData}
            lineChartOptions={this.state.lineChartOptions}
            room={this.state.room}
          />
        </Container>
        <Container>
          <Pie data={this.state.pie} />
        </Container>
      </div>
    );
  }
}

export default withStyles(() => {}, { withTheme: true })(Dashboard);
