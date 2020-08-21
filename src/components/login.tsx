import { Link } from "@reach/router";
import classNames from "clsx";
import React, { useContext } from "react";

import { useFormField } from "../hooks/form";
import { LanguageContext } from "../resources/language";

import "./login.scss";

export interface LoginProps {
  className?: string;

  onLoginStart?: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ className, onLoginStart }) => {
  const { LOGIN, PASSWORD_REMEMBER } = useContext(LanguageContext);
  const [email, handleEmailChange] = useFormField("");
  const [password, handlePasswordChange] = useFormField("");

  const canLogin = Boolean(email && password);

  const handleLogin = (ev: React.FormEvent) => {
    ev.preventDefault();
    onLoginStart && canLogin && onLoginStart(email, password);
  };

  return (
    <div className={classNames("login", className)}>
      <form className="box outline" action="#" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="wrapper">
          <input
            className="input outline"
            type="email"
            placeholder="E-Mail"
            onChange={handleEmailChange}
            value={email}
            autoComplete="email"
          />
          <input
            className="input outline"
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            value={password}
            autoComplete="current-password"
          />

          <a
            href="https://velocity-aachen.de/reg/"
            rel="noreferrer noopener"
            target="_blank"
          >
            {LOGIN.REGISTRIEREN}
          </a>
          <Link to="/forgot-password">{PASSWORD_REMEMBER.HYPERLINK}</Link>
        </div>

        <div className="actions">
          <button className="btn outline" disabled={!canLogin} type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
