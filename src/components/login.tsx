import { Link } from '@reach/router';
import React from 'react';

import { LanguageContext } from '../resources/language';

import './login.scss';

export interface LoginProps {
  onLoginStart?: (email: string, password: string) => void;
}

interface LoginState {
  email: string;
  password: string;
}
interface BodyProps extends LoginState {
  canLogin: boolean;

  onEmailChange: React.ChangeEventHandler<HTMLInputElement>;
  onPasswordChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const LoginBody: React.FC<BodyProps> = ({
  canLogin,
  email,
  password,

  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => (
  <LanguageContext.Consumer>
    {({ LOGIN, PASSWORD_REMEMBER }) => (
      <div className="login">
        <form
          className="box outline"
          action="#"
          onSubmit={onSubmit}
        >
          <h2>Login</h2>

          <div className="wrapper">
            <input
              className="input outline"
              type="email"
              placeholder="E-Mail"
              onChange={onEmailChange}
              value={email}
            />
            <input
              className="input outline"
              type="password"
              placeholder="Password"
              onChange={onPasswordChange}
              value={password}
            />

            <a
              href="https://velocity-aachen.de/reg/"
              target="_blank"
            >
              {LOGIN.REGISTRIEREN}
            </a>
            <Link to="/forgot-password">
              {PASSWORD_REMEMBER.HYPERLINK}
            </Link>
          </div>

          <div className="actions">
            <button
              className="btn outline"
              disabled={!canLogin}
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    )}
  </LanguageContext.Consumer>
);

class Login extends React.Component<LoginProps, LoginState> {
  state = {
    email: '',
    password: '',
  };

  render() {
    const canLogin = Boolean(this.state.email && this.state.password);

    return (
      <LoginBody
        {...this.state}
        canLogin={canLogin}
        onEmailChange={this.handleEmailChange}
        onPasswordChange={this.handlePasswordChange}
        onSubmit={this.handleFormSubmit}
      />
    );
  }

  private handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const { email, password } = this.state;
    if (this.props.onLoginStart && email && password) {
      this.props.onLoginStart(email, password);
    }
  }

  private handleEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: ev.target.value });
  }

  private handlePasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: ev.target.value });
  }
}

export default Login;
