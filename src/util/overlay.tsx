import classNames from 'classnames';
import React from 'react';
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
