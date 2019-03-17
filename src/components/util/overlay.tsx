import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
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

    const app = document.getElementById('root')!;

    // Disable touch events on the background
    app.classList.add(OVERLAY_OPEN_CLASS);

    // Disable scrolling on background
    disableBodyScroll(app, { reserveScrollBarGap: true });

    return () => {
      app.classList.remove(OVERLAY_OPEN_CLASS);
      enableBodyScroll(app);
    };
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
