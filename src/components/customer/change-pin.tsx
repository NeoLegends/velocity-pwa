import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { LanguageContext } from '../../resources/language';

interface ChangePinProps {
  onCancel: React.MouseEventHandler;
  onChangePin: (newPin: string, password: string) => void;
}

interface ChangePinState {
  password: string;
  pin: string;
}

interface BodyProps extends ChangePinState {
  canSubmit: boolean;

  onCancel: React.MouseEventHandler;
  onChangePassword: React.ChangeEventHandler<HTMLInputElement>;
  onChangePin: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const ChangePinBody: React.FC<BodyProps> = ({
  canSubmit,
  password,
  pin,

  onCancel,
  onChangePassword,
  onChangePin,
  onSubmit,
}) => (
  <LanguageContext.Consumer>
    {({ PARTICULARS }) => (
      <form className="change-pin box" onSubmit={onSubmit}>
        <h2>{PARTICULARS.MODAL.PIN.TITLE}</h2>

        <div className="wrapper">
          <input
            className="input outline"
            placeholder={PARTICULARS.MODAL.PIN.DESCRIPTION_PIN}
            type="tel"
            onChange={onChangePin}
            value={pin}
          />

          <input
            className="input outline"
            placeholder={PARTICULARS.MODAL.PIN.DESCRIPTION_PW}
            type="password"
            onChange={onChangePassword}
            value={password}
          />
        </div>

        <div className="actions">
          <button
            type="submit"
            className="btn outline"
            disabled={!canSubmit}
          >
            {PARTICULARS.MODAL.PIN.BUTTON.SUBMIT}
          </button>

          <button
            className="btn outline"
            onClick={onCancel}
          >
            {PARTICULARS.MODAL.PIN.BUTTON.CANCEL}
          </button>
        </div>
      </form>
    )}
  </LanguageContext.Consumer>
);

class ChangePin extends React.Component<
  ChangePinProps & RouteComponentProps,
  ChangePinState
> {
  state = {
    password: '',
    pin: '',
  };

  render() {
    const canSubmit =
      Boolean(this.state.password && /[0-9]{4}/.test(this.state.pin));

    return (
      <ChangePinBody
        {...this.state}
        canSubmit={canSubmit}
        onCancel={this.props.onCancel}
        onChangePassword={this.handlePasswordChange}
        onChangePin={this.handlePinChange}
        onSubmit={this.handleSubmit}
      />
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
