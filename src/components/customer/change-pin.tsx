import classNames from 'classnames';
import React, { useContext } from 'react';

import { useFormField } from '../../hooks/form';
import { useSavedPin } from '../../hooks/pin';
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
  const { customer, PARTICULARS } = useContext(LanguageContext);

  const [savedPin, setPin] = useSavedPin();
  const [password, handlePasswordChange] = useFormField('');
  const [pin, handlePinChange] = useFormField('');

  const handleSubmitChangePin = (ev: React.FormEvent) => {
    ev.preventDefault();
    onChangePin(pin, password);
  };
  const handleSubmitEraseSavedPin = (ev: React.FormEvent) => {
    ev.preventDefault();
    setPin(null);
  };

  const canSubmitChangePin = Boolean(password && /[0-9]{4}/.test(pin));

  return (
    <>
      <form
        className={classNames('change-pin box', className)}
        onSubmit={handleSubmitChangePin}
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
            disabled={!canSubmitChangePin}
          >
            {PARTICULARS.MODAL.PIN.BUTTON.SUBMIT}
          </button>

          <button className="btn outline" onClick={onCancel}>
            {PARTICULARS.MODAL.PIN.BUTTON.CANCEL}
          </button>
        </div>
      </form>

      {savedPin && (
        <form className="erase-pin box" onSubmit={handleSubmitEraseSavedPin}>
          <h2>{customer.PIN.REMOVE_SAVED_PIN}</h2>

          <div className="wrapper">
            <p>{customer.PIN.BODY.LINE1}</p>
            <p>{customer.PIN.BODY.LINE2}</p>
          </div>

          <div className="actions">
            <button className="btn outline" type="submit">
              {customer.PIN.ACTION}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ChangePin;
