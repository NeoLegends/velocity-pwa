import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import Measure, { ContentRect } from 'react-measure';

import './slider.scss';

interface BackgroundProps {
  className?: string;
  completion: number;
}

interface SliderProps {
  background?: React.ComponentType<BackgroundProps>;
  className?: string;
  completionPercentage?: number;
  disabled?: boolean;

  onCompleted?: () => void;
}

const clamp = (val: number, min: number, max: number) =>
  val < min
    ? min
    : val > max
      ? max
      : val;

const knobWidth = 64;
const knobPadding = 3;

const Slider: React.FC<SliderProps> = ({
  background: Background,
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
  const [maxSlideDistance, setMaxSlideDistance] = useState(Infinity);

  const completion = dx / maxSlideDistance;
  const isCompleted = completion > completionPercentage;

  const handleResize = useCallback(
    (rect: ContentRect) => {
      /**
       * We need to subtract the knob width once (since it's fully inside the
       * slider) and twice it's margin to the side to get the maximum distance
       * the knob is allowed to slide.
       */
      const slideDist = rect.client!.width - knobWidth - (2 * knobPadding);
      setMaxSlideDistance(slideDist);
    },
    [],
  );

  const handleDown = useCallback(() => {
    setDx(0);
    setIsDragging(true);
  }, []);
  const handleUp = useCallback(
    () => {
      if (isCompleted && typeof onCompleted === 'function') {
        onCompleted();
      }

      setDx(0);
      setTouchStartX(0);
      setIsDragging(false);
    },
    [isCompleted, onCompleted],
  );
  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (disabled || !isDragging) {
        return;
      }

      const movementX = ev.movementX;
      setDx(prev => clamp(prev + movementX, 0, maxSlideDistance));
    },
    [disabled, isDragging, maxSlideDistance],
  );
  const handleTouchStart = useCallback(
    (ev: React.TouchEvent) => {
      setTouchStartX(ev.touches[0].screenX);
      handleDown();
    },
    [handleDown],
  );
  const handleTouchMove = useCallback(
    (ev: TouchEvent) => {
      if (disabled || !isDragging) {
        return;
      }

      const dx = clamp(ev.touches[0].screenX - touchStartX, 0, maxSlideDistance);
      setDx(dx);
    },
    [disabled, isDragging, maxSlideDistance, touchStartX],
  );

  useEffect(
    () => {
      document.body.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('mouseup', handleUp);
      document.body.addEventListener('touchend', handleUp);
      document.body.addEventListener('touchmove', handleTouchMove);

      return () => {
        document.body.removeEventListener('mousemove', handleMouseMove);
        document.body.removeEventListener('mouseup', handleUp);
        document.body.removeEventListener('touchend', handleUp);
        document.body.removeEventListener('touchmove', handleTouchMove);
      };
    },
    [handleDown, handleMouseMove, handleTouchMove, handleTouchStart],
  );

  return (
    <Measure client onResize={handleResize}>
      {({ measureRef }) => (
        <div
          className={classNames(
            'slider outline',
            className,
            isCompleted && 'completed',
          )}
          ref={measureRef}
        >
          <div
            className="knob"
            onMouseDown={handleDown}
            onTouchStart={handleTouchStart}
            style={{ transform: `translateX(${dx}px)` }}
          >
            <span>➢</span>
          </div>

          {Background && (
            <Background className="background" completion={completion} />
          )}
        </div>
      )}
    </Measure>
  );
};

export default Slider;
