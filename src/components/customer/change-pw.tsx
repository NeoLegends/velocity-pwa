import { RouteComponentProps } from "@reach/router";
import classNames from "classnames";
import React, { useContext } from "react";

import { LanguageContext } from "../../resources/language";

interface ChangePasswordProps {
  className?: string;

  onCancel: React.MouseEventHandler;
  onRequestPasswordEmail: React.MouseEventHandler;
}

const ChangePassword: React.FC<ChangePasswordProps & RouteComponentProps> = ({
  className,

  onCancel,
  onRequestPasswordEmail,
}) => {
  const { PARTICULARS } = useContext(LanguageContext);

  return (
    <div className={classNames("change-pw box", className)}>
      <h2>{PARTICULARS.MODAL.PW.TITLE}</h2>

      <div className="wrapper">{PARTICULARS.MODAL.PW.TEXT}</div>

      <div className="actions">
        <button className="btn outline" onClick={onRequestPasswordEmail}>
          {PARTICULARS.MODAL.PW.BUTTON.SUBMIT}
        </button>

        <button className="btn outline" onClick={onCancel}>
          {PARTICULARS.MODAL.PW.BUTTON.CANCEL}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
