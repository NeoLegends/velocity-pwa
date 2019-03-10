import classNames from 'classnames';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useBodyDiv } from '../hooks/portal';

import './overlay.scss';

export interface OverlayMenuProps {
  className?: string;
  isOpen: boolean;

  onRequestClose?: React.MouseEventHandler;
}

const Overlay: React.FC<OverlayMenuProps> = ({
  children,
  className,
  isOpen,

  onRequestClose,
}) => {
  const element = useBodyDiv();

  // Prevent touch events on overlay background
  useEffect(
    () => {
      if (!isOpen) {
        return;
      }

      const root = document.getElementById('root')!;
      root.classList.add('no-touch-events');

      return () => root.classList.remove('no-touch-events');
    },
    [isOpen],
  );

  if (!element) {
    return null;
  }

  const dom = (
    <div
      className={classNames('backdrop', isOpen && 'visible', className)}
      onClick={onRequestClose}
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(dom, element);
};

export default Overlay;
