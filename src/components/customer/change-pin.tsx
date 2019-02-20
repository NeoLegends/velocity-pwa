import classNames from 'classnames';
import React, { useContext } from 'react';

import { useFormField } from '../../hooks/form';
import { LanguageContext } from '../../resources/language';

interface ChangePinProps {
  className?: string;

  onCancel: React.MouseEventHandler;
  onChangePin: (newPin: string, password: string) => void;
}

const ChangePin: React.FC<ChangePinProps> = ({
  className,

  onCancel,
  onChangePin,
}) => {
  const { PARTICULARS } = useContext(LanguageContext);
  const [password, handlePasswordChange] = useFormField('');
  const [pin, handlePinChange] = useFormField('');

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onChangePin(pin, password);
  };

  const canSubmit = Boolean(password && /[0-9]{4}/.test(pin));

  return (
    <form
      className={classNames('change-pin box', className)}
      onSubmit={handleSubmit}
    >
      <h2>{PARTICULARS.MODAL.PIN.TITLE}</h2>

      <div className="wrapper">
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.PIN.DESCRIPTION_PIN}
          type="tel"
          onChange={handlePinChange}
          value={pin}
        />

        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.PIN.DESCRIPTION_PW}
          type="password"
          onChange={handlePasswordChange}
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
  );
};

export default ChangePin;
