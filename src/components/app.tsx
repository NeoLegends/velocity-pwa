import { navigate, Router } from '@reach/router';
import React, { Component } from 'react';

import { isLoggedIn, login, logout } from '../model/authentication';
import Login from '../util/lazy-login';
import makeLazy from '../util/make-lazy';
import needsLogin from '../util/needs-login';

import './app.scss';
import MenuBar from './menu-bar';

interface AppBodyProps extends AppState {
  onLoginLogoutButtonClick?: React.MouseEventHandler;
  onLoginStart?: (email: string, password: string) => void;
  onLoginStartWithoutRedirect?: (email: string, password: string) => void;
}

interface AppState {
  isLoggedIn: boolean;
  loginStatusKnown: boolean;
}

const Bookings = needsLogin(makeLazy(() => import('./bookings')));
const Map = makeLazy(() => import('./map/bike-map'));

const AppBody: React.SFC<AppBodyProps> = ({
  isLoggedIn,
  loginStatusKnown,

  onLoginLogoutButtonClick,
  onLoginStart,
  onLoginStartWithoutRedirect,
}) => ((
  <div className="app">
    <MenuBar
      isLoggedIn={isLoggedIn}
      loginStatusKnown={loginStatusKnown}
      onLoginButtonClick={onLoginLogoutButtonClick}
    />

    <Router role="main" className="main">
      <Bookings
        path="/bookings"
        isLoggedIn={isLoggedIn}
        onLoginStart={onLoginStartWithoutRedirect}
      />
      <Login path="/login" onLoginStart={onLoginStart}/>
      <Map path="/" isLoggedIn={isLoggedIn}/>
    </Router>
  </div>
));

class App extends Component<{}, AppState> {
  state = {
    isLoggedIn: false,
    loginStatusKnown: false,
  };

  async componentDidMount() {
    await this.checkLogin();
  }

  render() {
    return (
      <AppBody
        {...this.state}
        onLoginLogoutButtonClick={this.handleLoginLogoutButton}
        onLoginStart={this.handleLoginWithRedirect}
        onLoginStartWithoutRedirect={this.handleLogin}
      />
    );
  }

  private async checkLogin() {
    const loggedIn = await isLoggedIn();
    this.setState({
      isLoggedIn: loggedIn,
      loginStatusKnown: true,
    });
  }

  private handleLogin = async (email: string, password: string) => {
    await login(email, password);
    await this.checkLogin();
  }

  private handleLoginWithRedirect = async (email: string, password: string) => {
    await this.handleLogin(email, password);

    navigate('/');
  }

  private handleLoginLogoutButton = async () => {
    if (this.state.isLoggedIn) {
      await logout();
      await this.checkLogin();
    } else {
      navigate('/login');
    }
  }
}

export default App;
