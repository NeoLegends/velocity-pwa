import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import './overlay.scss';

export interface OverlayMenuProps {
  isOpen: boolean;

  onRequestClose?: React.MouseEventHandler;
}

interface OverlayMenuState {
  element: HTMLElement | null;
}

class Overlay extends React.Component<OverlayMenuProps, OverlayMenuState> {
  state = {
    element: null,
  };

  componentDidMount() {
    const el = document.createElement('div');
    document.body.appendChild(el);

    this.setState({ element: el });
  }

  componentWillUnmount() {
    const el: HTMLElement | null = this.state.element;
    if (el) {
      (el as HTMLElement).remove();
    }
  }

  render() {
    if (!this.state.element) {
      return null;
    }

    const { isOpen, onRequestClose } = this.props as any;
    const dom = (
      <div
        className={classNames('backdrop', isOpen && 'visible')}
        onClick={onRequestClose}
      >
        {this.props.children}
      </div>
    );

    return ReactDOM.createPortal(dom, this.state.element!);
  }
}

export default Overlay;
