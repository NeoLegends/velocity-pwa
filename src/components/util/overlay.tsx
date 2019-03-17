import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import classNames from 'classnames';
import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { useBodyDiv } from '../../hooks/portal';

import './overlay.scss';

export interface OverlayContentProps {
  focusRef: React.Ref<any>;
}

export interface OverlayMenuProps {
  children: React.ComponentType<OverlayContentProps>;
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
  const [focusRef, setFocusRef] = useState<unknown>(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const app = document.getElementById('root')!;

    // Disable touch events on the background
    app.classList.add(OVERLAY_OPEN_CLASS);

    // Disable scrolling on background
    disableBodyScroll(app, { reserveScrollBarGap: true });

    // Autofocus first focusable element
    if (
      focusRef &&
      typeof (focusRef as HTMLOrSVGElement).focus === 'function'
    ) {
      (focusRef as HTMLOrSVGElement).focus();
    }

    return () => {
      app.classList.remove(OVERLAY_OPEN_CLASS);
      enableBodyScroll(app);
    };
  }, [focusRef, isOpen]);

  if (!element) {
    return null;
  }

  const Children = children;

  const dom = (
    <div
      className={classNames('backdrop', isOpen && 'visible', className)}
      onClick={onRequestClose}
    >
      <Children focusRef={setFocusRef} />
    </div>
  );

  return ReactDOM.createPortal(dom, element);
};

export default Overlay;
