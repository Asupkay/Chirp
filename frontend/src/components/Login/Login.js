import React, { Component } from 'react';
import firebase from 'firebase';
import Dashboard from '../Dashboard/Dashboard';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import './Login.css'

firebase.initializeApp({
  apiKey: 'AIzaSyAAvY6B5kU2wEW4VuQflawZzCweyJu4Hgo',
  authDomain: 'engineering-capstone.firebaseapp.com'
});

class Login extends Component {
  state = { isSignedIn: false };
  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
      console.log('user', user);
    });
  };

  render() {
    return (
      <div className="Login">
        <div>
          <h1 height="-5000px">Welcome to Chirp - The Online Twitter Sentiment Analysis Software</h1>
        </div>
        {this.state.isSignedIn ? (
          <span>
            <Dashboard />
          </span>
        ) : (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    );
  }
}

export default Login;
