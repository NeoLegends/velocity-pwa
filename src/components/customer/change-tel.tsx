import { RouteComponentProps } from '@reach/router';
import React from 'react';

interface ChangeTelProps {
  onCancel: React.MouseEventHandler;
  onChangeTel: (newTel: string) => void;
}

interface ChangeTelState {
  tel: string;
}

class ChangeTel extends React.Component<ChangeTelProps & RouteComponentProps, ChangeTelState> {
  state = {
    tel: '',
  };

  render() {
    const canSubmit = /^[+-\s./0-9]{0,20}$/.test(this.state.tel);

    return (
      <form className="change-tel box" onSubmit={this.handleSubmit}>
        <h2>Telefonnummer ändern</h2>

        <div className="wrapper">
          <p>
            Wir verwenden Ihre Telefonnummer um Sie bei Rückfragen zu Rechnungen
            oder Supportfragen kontaktieren zu könnnen.
          </p>

          <input
            className="input outline"
            placeholder="Telefonnummer"
            type="tel"
            onChange={this.handleTelChange}
            value={this.state.tel}
          />
        </div>

        <div className="actions">
          <button
            type="submit"
            className="btn outline"
            disabled={!canSubmit}
          >
            Telefonnummer ändern
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

  private handleTelChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ tel: ev.target.value })

  private handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    this.props.onChangeTel(this.state.tel);
  }
}

export default ChangeTel;
