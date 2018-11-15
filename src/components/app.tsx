import { Router } from '@reach/router';
import React, { Component } from 'react';

import { isLoggedIn, login } from '../model/authentication';
import makeLazy from '../util/make-lazy';

import './app.scss';
import MenuBar from './menu-bar';

interface AppBodyProps extends AppState {
  onLoginLogoutButtonClick?: React.MouseEventHandler;
  onLoginStart?: (email: string, password: string) => void;
}

interface AppState {
  isLoggedIn: boolean;
  loginStatusKnown: boolean;
}

const Login = makeLazy(() => import('./login'));
const Map = makeLazy(() => import('./map/bike-map'));

const AppBody: React.SFC<AppBodyProps> = props => {
  const {
    isLoggedIn,
    loginStatusKnown,

    onLoginLogoutButtonClick,
    onLoginStart,
  } = props;

  return (
    <div className="app">
      <MenuBar
        isLoggedIn={isLoggedIn}
        loginStatusKnown={loginStatusKnown}
        onLoginButtonClick={onLoginLogoutButtonClick}
      />

      <Router>
        <Login path="/login" onLoginStart={onLoginStart}/>
        <Map default path="/map"/>
      </Router>
    </div>
  );
};

class App extends Component<{}, AppState> {
  state = {
    isLoggedIn: false,
    loginStatusKnown: false,
  };

  componentDidMount() {
    this.checkLogin();
  }

  render() {
    return (
      <AppBody
        {...this.state}
        onLoginLogoutButtonClick={this.handleLoginLogoutButton}
        onLoginStart={this.handleLogin}
      />
    );
  }

  private checkLogin() {
    isLoggedIn()
      .then(loggedIn => this.setState({
        isLoggedIn: loggedIn,
        loginStatusKnown: true,
      }));
  }

  private handleLogin = (email: string, password: string) => {
    login(email, password)
      .then(this.checkLogin);
  }

  private handleLoginLogoutButton = () => {};
}

export default App;
