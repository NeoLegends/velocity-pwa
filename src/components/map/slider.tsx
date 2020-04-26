import useComponentSize from "@rehooks/component-size";
import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";

import "./slider.scss";

interface BackgroundProps {
  completion: number;
}

interface SliderProps {
  background?: React.FC<BackgroundProps>;
  className?: string;
  completionPercentage?: number;
  disabled?: boolean;

  onCompleted?: () => void;
}

const clamp = (val: number, min: number, max: number) =>
  val < min ? min : val > max ? max : val;

const knobWidth = 64;
const knobPadding = 4;

const Slider: React.FC<SliderProps> = ({
  background,
  className,
  completionPercentage = 0.9,
  disabled,

  onCompleted,
}) => {
  if (completionPercentage <= 0) {
    throw new Error("completionPercentage must be > 0");
  }

  const [isDragging, setIsDragging] = useState(false);
  const [dx, setDx] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const measureRef = useRef<any>();
  const { width } = useComponentSize(measureRef);

  /**
   * We need to subtract the knob width once (since it's fully inside the
   * slider) and twice it's margin to the side to get the maximum distance
   * the knob is allowed to slide.
   */
  const maxSlideDistance = width - knobWidth - 2 * knobPadding;

  const completion = dx / maxSlideDistance;
  const isCompleted = completion > completionPercentage;

  const handleDown = useCallback(() => {
    if (disabled) {
      return;
    }

    setDx(0);
    setIsDragging(true);
  }, [disabled]);
  const handleUp = useCallback(() => {
    if (disabled) {
      return;
    }

    if (isCompleted && typeof onCompleted === "function") {
      onCompleted();
    }

    setIsDragging(false);
    setDx(0);
    setTouchStartX(0);
  }, [disabled, isCompleted, onCompleted]);
  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (disabled || !isDragging) {
        return;
      }

      const movementX = ev.movementX;
      setDx((prev) => clamp(prev + movementX, 0, maxSlideDistance));
    },
    [disabled, isDragging, maxSlideDistance],
  );
  const handleTouchStart = useCallback(
    (ev: React.TouchEvent) => {
      if (disabled) {
        return;
      }

      setTouchStartX(ev.touches[0].screenX);
      handleDown();
    },
    [disabled, handleDown],
  );
  const handleTouchMove = useCallback(
    (ev: TouchEvent) => {
      if (disabled || !isDragging) {
        return;
      }

      const dx = clamp(
        ev.touches[0].screenX - touchStartX,
        0,
        maxSlideDistance,
      );
      setDx(dx);
    },
    [disabled, isDragging, maxSlideDistance, touchStartX],
  );

  useEffect(() => {
    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleUp);
    document.body.addEventListener("touchend", handleUp);
    document.body.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseup", handleUp);
      document.body.removeEventListener("touchend", handleUp);
      document.body.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove, handleUp]);

  return (
    <div
      className={classNames(
        "slider outline",
        className,
        isCompleted && "completed",
      )}
      ref={measureRef}
    >
      <div
        className={classNames(
          "knob",
          isDragging && "dragging",
          disabled && "disabled",
        )}
        onMouseDown={handleDown}
        onTouchStart={handleTouchStart}
        style={{ transform: `translateX(${dx}px)` }}
      >
        <span>➢</span>
      </div>

      {background && background({ completion })}
    </div>
  );
};

export default Slider;
