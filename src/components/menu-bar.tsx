import { Link } from '@reach/router';
import React from 'react';

import { LOGO_URL } from '../resources/logo';
import Overlay from '../util/overlay';

import Menu, { MenuEntries } from './menu';
import './menu-bar.scss';

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
      <header className="menu-bar">
        <Link to="/">
          <img className="logo" src={LOGO_URL}/>
        </Link>

        <MenuEntries/>

        <div className="flex-grow"/>

        <button
          className="btn outline"
          onClick={this.props.onLoginButtonClick}
        >
          {this.props.isLoggedIn ? "Abmelden" : "Anmelden"}
        </button>
        <button
          className="btn outline btn-menu"
          onClick={this.onMenuButtonClicked}
        >
          Menü
        </button>

        <Overlay
          isOpen={this.state.isMenuOpen}
          onRequestClose={this.onRequestMenuClose}
        >
          <Menu/>
        </Overlay>
      </header>
    );
  }

  onMenuButtonClicked = () => this.setState({ isMenuOpen: true });

  onRequestMenuClose = () => this.setState({ isMenuOpen: false });
}

export default MenuBar;
