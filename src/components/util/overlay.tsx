import classNames from 'classnames';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useBodyDiv } from '../../hooks/portal';

import './overlay.scss';

export interface OverlayMenuProps {
  className?: string;
  isOpen: boolean;

  onRequestClose?: React.MouseEventHandler;
}

const OVERLAY_OPEN_CLASS = 'overlay-open';

const Overlay: React.FC<OverlayMenuProps> = ({
  children,
  className,
  isOpen,

  onRequestClose,
}) => {
  const element = useBodyDiv();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Disable touch events on the background
    const app = document.getElementById('root')!;
    app.classList.add(OVERLAY_OPEN_CLASS);

    return () => app.classList.remove(OVERLAY_OPEN_CLASS);
  }, [isOpen]);

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
