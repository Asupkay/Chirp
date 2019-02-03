import React, { Component } from 'react'
//import {  Router, Route, browserHistory } from 'react-router'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//App Layouts
import Social from './components/social/'
import Dashboard from './components/Dashboard/'
import Chart from './components/chart/'

//Import css for the application
import './index.css'

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Route exact path="/" component={Social}></Route>
            <Route path="/social" component={Social}></Route>
            <Route path="/chart" component={Chart}></Route>
          </div>
        </Router>
    );
  }
}

export default App;
