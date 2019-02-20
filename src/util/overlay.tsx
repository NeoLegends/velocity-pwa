import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setElement(el);

    return () => el.remove();
  }, []);

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
