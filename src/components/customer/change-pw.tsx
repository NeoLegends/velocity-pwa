import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { LanguageContext } from '../../util/language';

interface ChangePasswordProps {
  onCancel: React.MouseEventHandler;
  onRequestPasswordEmail: React.MouseEventHandler;
}

const ChangePassword: React.FC<ChangePasswordProps & RouteComponentProps> = ({
  onCancel,
  onRequestPasswordEmail,
}) => (
  <LanguageContext.Consumer>
    {({ PARTICULARS }) => (
      <div className="change-pw box">
        <h2>{PARTICULARS.MODAL.PW.TITLE}</h2>

        <div className="wrapper">
          {PARTICULARS.MODAL.PW.TEXT}
        </div>

        <div className="actions">
          <button
            className="btn outline"
            onClick={onRequestPasswordEmail}
          >
            {PARTICULARS.MODAL.PW.BUTTON.SUBMIT}
          </button>

          <button
            className="btn outline"
            onClick={onCancel}
          >
            {PARTICULARS.MODAL.PW.BUTTON.CANCEL}
          </button>
        </div>
      </div>
    )}
  </LanguageContext.Consumer>
);

export default ChangePassword;
