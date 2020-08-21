import classNames from "clsx";
import React from "react";

import "./spinner.scss";

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => (
  <div className={classNames("spinner", className)}>
    <div className="ellipsis">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default Spinner;
