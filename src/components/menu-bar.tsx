import React from 'react';

import logo from '../resources/logo.png';

import './menu-bar.scss';
import OverlayMenu from './overlay-menu';

export interface MenuBarProps {
  isLoggedIn: boolean;
  loginStatusKnown: boolean;

  onLoginButtonClick?: React.MouseEventHandler;
}

interface MenuBarState {
  isMenuOpen: boolean;
}

class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
  state = {
    isMenuOpen: false,
  };

  render() {
    return (
      <div className="menu-bar">
        <img className="logo" src={logo}/>

        <div className="flex-grow"/>

        <button
          className="btn outline"
          onClick={this.props.onLoginButtonClick}
        >
          {this.props.isLoggedIn ? "Anmelden" : "Abmelden"}
        </button>
        <button
          className="btn outline menu"
          onClick={this.onMenuButtonClicked}
        >
          Menü
        </button>

        <OverlayMenu
          isOpen={this.state.isMenuOpen}
          onRequestMenuClose={this.onRequestMenuClose}
        />
      </div>
    );
  }

  onMenuButtonClicked = () => this.setState({ isMenuOpen: true });

  onRequestMenuClose = () => this.setState({ isMenuOpen: false });
}

export default MenuBar;
