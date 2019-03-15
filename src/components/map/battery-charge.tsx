import classNames from 'classnames';
import React from "react";

import './battery-charge.scss';

interface BatteryChargeProps {
    chargePercentage: number;
    className?: string;
}

const BatteryCharge: React.FC<BatteryChargeProps> = ({chargePercentage, className}) => (
  <svg
    className={classNames(
      "zap-icon",
      chargePercentage >= 40 ? "full-battery" : "low-battery",
      className)}
    width="500"
    height="500"
    version="1.1"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x={0}
      y={100 - chargePercentage}
      width={100}
      height={chargePercentage}
      fill="none"
      clipPath="url(#clip)"
    />
    <polygon
      x={0}
      y={0}
      points="75, 0 17.5, 55 45, 55 25, 100 82.5, 45 55, 45"
      stroke="none"
      fill="none"
    />
    <clipPath id="clip">
      <polygon
        x={0}
        y={0}
        points="75, 0 17.5, 55 45, 55 25, 100 82.5, 45 55, 45"
        stroke="none"
        fill="none"
      />
    </clipPath>
  </svg>
);

export default BatteryCharge;
