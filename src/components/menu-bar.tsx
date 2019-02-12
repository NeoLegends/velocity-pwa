import { Link } from '@reach/router';
import React, { useContext, useState } from 'react';

import { LanguageContext, LanguageIdentifier } from '../resources/language';
import logo from '../resources/logo.png';
import Overlay from '../util/overlay';

import Menu, { MenuEntries } from './menu';
import './menu-bar.scss';

export interface MenuBarProps {
  isLoggedIn: boolean;
  loginStatusKnown: boolean;

  onChangeLanguage: (lang: LanguageIdentifier) => void;
  onLoginButtonClick: React.MouseEventHandler;
}

const MenuBar: React.FC<MenuBarProps> = ({
  isLoggedIn,
  loginStatusKnown,

  onChangeLanguage,
  onLoginButtonClick,
}) => {
  const { menu, NAVIGATION } = useContext(LanguageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="menu-bar">
      <Link to="/">
        <img className="logo" src={logo}/>
      </Link>

      <MenuEntries/>

      <div className="flex-grow"/>

      <button
        className="btn transparent"
        onClick={() => onChangeLanguage('de')}
      >
        DE
      </button>
      <button
        className="btn transparent"
        onClick={() => onChangeLanguage('en')}
      >
        EN
      </button>

      <button
        className="btn outline"
        onClick={onLoginButtonClick}
      >
        {loginStatusKnown
          ? isLoggedIn
            ? NAVIGATION.SIGN_OUT_BTN
            : NAVIGATION.SIGN_IN_BTN
          : '...'}
      </button>
      <button
        className="btn outline btn-menu"
        onClick={() => setIsMenuOpen(true)}
      >
        {menu}
      </button>

      <Overlay
        isOpen={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Menu/>
      </Overlay>
    </header>
  );
};

export default MenuBar;
