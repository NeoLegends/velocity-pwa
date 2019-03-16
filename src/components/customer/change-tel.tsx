import classNames from 'classnames';
import React, { useContext } from 'react';

import { useFormField } from '../../hooks/form';
import { LanguageContext } from '../../resources/language';

interface ChangeTelProps {
  className?: string;
  currentTel: string | null;

  onCancel: React.MouseEventHandler;
  onChangeTel: (newTel: string) => void;
}

const ChangeTel: React.FC<ChangeTelProps> = ({
  className,
  currentTel,

  onCancel,
  onChangeTel,
}) => {
  const { PARTICULARS } = useContext(LanguageContext);
  const [tel, handleTelChange] = useFormField(currentTel || '');

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    onChangeTel(tel);
  };

  const canSubmit = /^[+-\s./0-9]{0,20}$/.test(tel);

  return (
    <form
      className={classNames('change-tel box', className)}
      onSubmit={handleSubmit}
    >
      <h2>{PARTICULARS.MODAL.PHONE.TITLE}</h2>

      <div className="wrapper">
        <p>{PARTICULARS.MODAL.PHONE.DESCRIPTION_USAGE}</p>

        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.PHONE.DESCRIPTION_PHONE}
          type="tel"
          onChange={handleTelChange}
          value={tel}
        />
      </div>

      <div className="actions">
        <button type="submit" className="btn outline" disabled={!canSubmit}>
          {PARTICULARS.MODAL.PHONE.BUTTON.SUBMIT}
        </button>

        <button className="btn outline" onClick={onCancel}>
          {PARTICULARS.MODAL.PHONE.BUTTON.CANCEL}
        </button>
      </div>
    </form>
  );
};

export default ChangeTel;
