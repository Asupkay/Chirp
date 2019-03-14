import React, { Component } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import NoMatch from './components/NoMatch/noMatch';
import Login from "./components/Login/Login";
import "./index.css";


class App extends Component {
  render() {
    return (
      <Router>
        <div >
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/NewsFeed" component={Login} />
          <Route component={ NoMatch } />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
