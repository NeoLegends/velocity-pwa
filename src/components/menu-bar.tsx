import { Link } from '@reach/router';
import React from 'react';

import { LanguageContext, LanguageIdentifier } from '../resources/language';
import logo from '../resources/logo.png';
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
interface MenuBarBodyProps extends MenuBarState {
  isLoggedIn: boolean;

  onClickDeLanguageButton: React.MouseEventHandler;
  onClickEnLanguageButton: React.MouseEventHandler;
  onClickLoginButton?: React.MouseEventHandler;
  onClickMenuButton: React.MouseEventHandler;
  onRequestMenuClose: React.MouseEventHandler;
}

const MenuBarBody: React.FC<MenuBarBodyProps> = ({
  isLoggedIn,
  isMenuOpen,

  onClickDeLanguageButton,
  onClickEnLanguageButton,
  onClickLoginButton,
  onClickMenuButton,
  onRequestMenuClose,
}) => (
  <LanguageContext.Consumer>
    {({ menu, NAVIGATION }) => (
      <header className="menu-bar">
        <Link to="/">
          <img className="logo" src={logo}/>
        </Link>

        <MenuEntries/>

        <div className="flex-grow"/>

        <button
          className="btn transparent"
          onClick={onClickDeLanguageButton}
        >
          DE
        </button>
        <button
          className="btn transparent"
          onClick={onClickEnLanguageButton}
        >
          EN
        </button>

        <button
          className="btn outline"
          onClick={onClickLoginButton}
        >
          {isLoggedIn
            ? NAVIGATION.SIGN_OUT_BTN
            : NAVIGATION.SIGN_IN_BTN}
        </button>
        <button
          className="btn outline btn-menu"
          onClick={onClickMenuButton}
        >
          {menu}
        </button>

        <Overlay
          isOpen={isMenuOpen}
          onRequestClose={onRequestMenuClose}
        >
          <Menu/>
        </Overlay>
      </header>
    )}
  </LanguageContext.Consumer>
);

class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
  state = { isMenuOpen: false };

  render() {
    return (
      <MenuBarBody
        {...this.state}
        isLoggedIn={this.props.isLoggedIn}
        onClickDeLanguageButton={this.handleClickDeLanguageButton}
        onClickEnLanguageButton={this.handleClickEnLanguageButton}
        onClickLoginButton={this.props.onLoginButtonClick}
        onClickMenuButton={this.handleClickMenuButton}
        onRequestMenuClose={this.handleRequestMenuClose}
      />
    );
  }

  private handleClickMenuButton = () => this.setState({ isMenuOpen: true });

  private handleClickDeLanguageButton = (ev: React.MouseEvent) => {
    ev.preventDefault();
    this.props.onChangeLanguage && this.props.onChangeLanguage('de');
  }

  private handleClickEnLanguageButton = (ev: React.MouseEvent) => {
    ev.preventDefault();
    this.props.onChangeLanguage && this.props.onChangeLanguage('en');
  }

  private handleRequestMenuClose = () => this.setState({ isMenuOpen: false });
}

export default MenuBar;
