import { RouteComponentProps } from '@reach/router';
import React from 'react';

interface ChangePasswordProps {
  onCancel: React.MouseEventHandler;
  onRequestPasswordEmail: React.MouseEventHandler;
}

const ChangePassword: React.FC<ChangePasswordProps & RouteComponentProps> = ({
  onCancel,
  onRequestPasswordEmail,
}) => (
  <div className="change-pw box">
    <h2>Passwort ändern</h2>

    <div className="wrapper">
      Wir senden Ihnen einen Link per E-Mail zu, über den sie Ihr Passwort zurücksetzen können.
    </div>

    <div className="actions">
      <button
        className="btn outline"
        onClick={onRequestPasswordEmail}
      >
        E-Mail senden
      </button>

      <button
        className="btn outline"
        onClick={onCancel}
      >
        Abbrechen
      </button>
    </div>
  </div>
);

export default ChangePassword;
