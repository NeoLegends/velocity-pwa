import { RouteComponentProps } from '@reach/router';
import React from 'react';

interface ChangePinProps {
  onCancel: React.MouseEventHandler;
  onChangePin: (newPin: string, password: string) => void;
}

interface ChangePinState {
  password: string;
  pin: string;
}

class ChangePin extends React.Component<ChangePinProps & RouteComponentProps, ChangePinState> {
  state = {
    password: '',
    pin: '',
  };

  render() {
    return (
      <form className="change-pin box" onSubmit={this.handleSubmit}>
        <h2>PIN ändern</h2>

        <div className="wrapper">
          <input
            className="input outline"
            placeholder="Neue vierstellige PIN"
            type="tel"
            onChange={this.handlePinChange}
            value={this.state.pin}
          />

          <input
            className="input outline"
            placeholder="Passwort zur Verifikation"
            type="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
          />
        </div>

        <div className="actions">
          <button
            type="submit"
            className="btn outline"
            disabled={!this.canSubmit()}
          >
            PIN ändern
          </button>

          <button
            className="btn outline"
            onClick={this.props.onCancel}
          >
            Abbrechen
          </button>
        </div>
      </form>
    );
  }

  private canSubmit() {
    return Boolean(this.state.password && /[0-9]{4}/.test(this.state.pin));
  }

  private handlePasswordChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ password: ev.target.value })

  private handlePinChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ pin: ev.target.value })

  private handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    this.props.onChangePin(
      this.state.pin,
      this.state.password,
    );
  }
}

export default ChangePin;
