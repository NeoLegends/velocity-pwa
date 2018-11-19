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

// tslint:disable-next-line
const hoc = function<P>(Comp: React.ComponentType<P>) {
  return class extends React.Component<OverlayMenuProps & P, OverlayMenuState> {
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

      const { isOpen, onRequestClose, ...rest } = this.props as any;
      const dom = (
        <div
          className={classNames('backdrop', { ['visible']: isOpen })}
          onClick={onRequestClose}
        >
          <Comp {...rest}/>
        </div>
      );

      return ReactDOM.createPortal(dom, this.state.element!);
    }
  };
};

export default hoc;
