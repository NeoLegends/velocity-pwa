import { Link } from '@reach/router';
import React from 'react';

import './login.scss';

export interface LoginProps {
  onLoginStart?: (email: string, password: string) => void;
}

interface LoginState {
  email: string;
  password: string;
}

class Login extends React.Component<LoginProps, LoginState> {
  state = {
    email: '',
    password: '',
  };

  render() {
    return (
      <div className="login">
        <div className="box outline">
          <h1>Login</h1>

          <div className="wrapper">
            <input
              className="input outline"
              type="email"
              placeholder="E-Mail"
              onChange={this.handleEmailChange}
              value={this.state.email}
            />
            <input
              className="input outline"
              type="password"
              placeholder="Password"
              onChange={this.handlePasswordChange}
              value={this.state.password}
            />

            <a href="https://velocity-aachen.de/reg/">Jetzt registrieren</a>
            <Link to="/forgot-password">Passwort vergessen?</Link>

            <button
              className="btn outline"
              disabled={!this.state.email || !this.state.password}
              onClick={this.handleLoginClicked}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  handleLoginClicked = () => {
    const { email, password } = this.state;
    if (this.props.onLoginStart && email && password) {
      this.props.onLoginStart(email, password);
    }
  }

  handleEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: ev.target.value });
  }

  handlePasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: ev.target.value });
  }
}

export default Login;
