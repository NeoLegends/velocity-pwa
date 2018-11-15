import { navigate, Router } from '@reach/router';
import React, { Component } from 'react';

import { isLoggedIn, login, logout } from '../model/authentication';
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

const AppBody: React.SFC<AppBodyProps> = ({
  isLoggedIn,
  loginStatusKnown,

  onLoginLogoutButtonClick,
  onLoginStart,
}) => ((
  <div className="app">
    <MenuBar
      isLoggedIn={isLoggedIn}
      loginStatusKnown={loginStatusKnown}
      onLoginButtonClick={onLoginLogoutButtonClick}
    />

    <Router role="main" className="main">
      <Login path="/login" onLoginStart={onLoginStart}/>
      <Map
        default
        path="/map"
        isLoggedIn={isLoggedIn}
      />
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
        onLoginStart={this.handleLogin}
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

  private handleLoginLogoutButton = async () => {
    if (this.state.isLoggedIn) {
      await logout();
    } else {
      navigate('/login');
    }
  }
}

export default App;
