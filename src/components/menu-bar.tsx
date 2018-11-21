import { Link } from '@reach/router';
import React from 'react';

import { LOGO_URL } from '../resources/logo';
import { LanguageContext, LanguageIdentifier } from '../util/language';
import Overlay from '../util/overlay';

import Menu, { MenuEntries } from './menu';
import './menu-bar.scss';

export interface MenuBarProps {
  isLoggedIn: boolean;
  loginStatusKnown: boolean;

  onChangeLanguage?: (lang: LanguageIdentifier) => void;
  onLoginButtonClick?: React.MouseEventHandler;
}

interface MenuBarState {
  isMenuOpen: boolean;
}

class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
  static contextType = LanguageContext;

  context!: React.ContextType<typeof LanguageContext>;
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
          className="btn transparent"
          onClick={this.handleClickDe}
        >
          DE
        </button>
        <button
          className="btn transparent"
          onClick={this.handleClickEn}
        >
          EN
        </button>

        <button
          className="btn outline"
          onClick={this.props.onLoginButtonClick}
        >
          {this.props.isLoggedIn
            ? this.context.NAVIGATION.SIGN_OUT_BTN
            : this.context.NAVIGATION.SIGN_IN_BTN}
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

  private handleClickDe = (ev: React.MouseEvent) => {
    ev.preventDefault();
    this.props.onChangeLanguage && this.props.onChangeLanguage('de');
  }

  private handleClickEn = (ev: React.MouseEvent) => {
    ev.preventDefault();
    this.props.onChangeLanguage && this.props.onChangeLanguage('en');
  }
}

export default MenuBar;
