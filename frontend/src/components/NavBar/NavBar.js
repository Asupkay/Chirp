import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Image } from 'semantic-ui-react';
import Twitter_Logo from './Twitter_Background.jpg';

const bStyle = { backgroundColor: '#08a0e9' };

const routeMap = {
  'Who We Are': 'who',
  Home: 'home',
  Brothers: 'brothers',
  Alumni: 'alumni',
  Recruitment: 'recruitment',
  Contact: 'contact'
};

class NavBar extends Component {
  state = { activeItem: 'Home' };

  constructor(props) {
    super(props);
    this.state.activeItem = this.props.history.location.pathname;
  }

  handleItemClick = (e, { name }) => {
    const route = routeMap[name];
    this.setState({ activeItem: `/${route}` });
    this.props.history.push(route);
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu inverted borderless style={bStyle}>
        <Menu.Item>
          <Image src={Twitter_Logo} className="ui mini image" alt="logo" />
        </Menu.Item>
        <Menu.Item header>Chirp Twitter Sentiment Analysis</Menu.Item>
        <Menu.Item
          name="Home"
          active={activeItem === '#'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name="Social"
          active={activeItem === '#'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name="Login"
          active={activeItem === '#'}
          onClick={this.handleItemClick}
        />
      </Menu>
    );
  }
}

export default withRouter(NavBar);
