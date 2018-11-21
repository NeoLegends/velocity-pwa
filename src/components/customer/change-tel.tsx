import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { LanguageContext } from '../../util/language';

interface ChangeTelProps {
  onCancel: React.MouseEventHandler;
  onChangeTel: (newTel: string) => void;
}

interface ChangeTelState {
  tel: string;
}

class ChangeTel extends React.Component<ChangeTelProps & RouteComponentProps, ChangeTelState> {
  static contextType = LanguageContext;

  context!: React.ContextType<typeof LanguageContext>;
  state = {
    tel: '',
  };

  render() {
    const canSubmit = /^[+-\s./0-9]{0,20}$/.test(this.state.tel);

    return (
      <form className="change-tel box" onSubmit={this.handleSubmit}>
        <h2>{this.context.PARTICULARS.MODAL.PHONE.TITLE}</h2>

        <div className="wrapper">
          <p>
            {this.context.PARTICULARS.MODAL.PHONE.DESCRIPTION_USAGE}
          </p>

          <input
            className="input outline"
            placeholder={this.context.PARTICULARS.MODAL.PHONE.DESCRIPTION_PHONE}
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
            {this.context.PARTICULARS.MODAL.PHONE.BUTTON.SUBMIT}
          </button>

          <button
            className="btn outline"
            onClick={this.props.onCancel}
          >
            {this.context.PARTICULARS.MODAL.PHONE.BUTTON.CANCEL}
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
