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
    const canLogin = this.state.email && this.state.password;

    return (
      <div className="login">
        <form
          className="box outline"
          action="#"
          onSubmit={this.handleFormSubmit}
        >
          <h2>Login</h2>

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

            <a
              href="https://velocity-aachen.de/reg/"
              target="_blank"
            >
              Jetzt registrieren
            </a>
            <Link to="/forgot-password">Passwort vergessen?</Link>
          </div>

          <div className="actions">
            <button
              className="btn outline"
              disabled={!canLogin}
              onClick={this.handleLoginClicked}
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    this.handleLoginClicked();
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
