import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { LanguageContext } from '../../util/language';

interface ChangePinProps {
  onCancel: React.MouseEventHandler;
  onChangePin: (newPin: string, password: string) => void;
}

interface ChangePinState {
  password: string;
  pin: string;
}

class ChangePin extends React.Component<ChangePinProps & RouteComponentProps, ChangePinState> {
  static contextType = LanguageContext;

  context!: React.ContextType<typeof LanguageContext>;
  state = {
    password: '',
    pin: '',
  };

  render() {
    const canSubmit = this.state.password && /[0-9]{4}/.test(this.state.pin);

    return (
      <form className="change-pin box" onSubmit={this.handleSubmit}>
        <h2>{this.context.PARTICULARS.MODAL.PIN.TITLE}</h2>

        <div className="wrapper">
          <input
            className="input outline"
            placeholder={this.context.PARTICULARS.MODAL.PIN.DESCRIPTION_PIN}
            type="tel"
            onChange={this.handlePinChange}
            value={this.state.pin}
          />

          <input
            className="input outline"
            placeholder={this.context.PARTICULARS.MODAL.PIN.DESCRIPTION_PW}
            type="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
          />
        </div>

        <div className="actions">
          <button
            type="submit"
            className="btn outline"
            disabled={!canSubmit}
          >
            {this.context.PARTICULARS.MODAL.PIN.BUTTON.SUBMIT}
          </button>

          <button
            className="btn outline"
            onClick={this.props.onCancel}
          >
            {this.context.PARTICULARS.MODAL.PIN.BUTTON.CANCEL}
          </button>
        </div>
      </form>
    );
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
