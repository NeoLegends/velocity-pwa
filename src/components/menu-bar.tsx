import { Link } from '@reach/router';
import classNames from 'classnames';
import React, { useCallback, useContext, useState } from 'react';

import { LanguageContext, LanguageIdentifier } from '../resources/language';
import logo from '../resources/logo.png';

import Menu, { MenuEntries, MenuEntriesProps } from './menu';
import './menu-bar.scss';
import Overlay from './util/overlay';

export interface MenuBarProps extends MenuEntriesProps {
  className?: string;
  isLoggedIn: boolean;
  loginStatusKnown: boolean;

  onChangeLanguage: (lang: LanguageIdentifier) => void;
  onLoginButtonClick: React.MouseEventHandler;
}

const MenuBar: React.FC<MenuBarProps> = ({
  canInstall,
  className,
  isLoggedIn,
  loginStatusKnown,

  onChangeLanguage,
  onClickInstallOnDevice,
  onLoginButtonClick,
}) => {
  const { menu, NAVIGATION } = useContext(LanguageContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);

  const setEnglish = useCallback(() => onChangeLanguage('en'), [onChangeLanguage]);
  const setGerman = useCallback(() => onChangeLanguage('de'), [onChangeLanguage]);

  return (
    <header className={classNames('menu-bar', className)}>
      <Link to="/">
        <img className="logo" src={logo}/>
      </Link>

      <MenuEntries
        canInstall={canInstall}
        onClickInstallOnDevice={onClickInstallOnDevice}
      />

      <div className="flex-grow"/>

      <button
        className="btn transparent"
        onClick={setGerman}
      >
        DE
      </button>
      <button
        className="btn transparent"
        onClick={setEnglish}
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
        onClick={openMenu}
      >
        {menu}
      </button>

      <Overlay
        isOpen={isMenuOpen}
        onRequestClose={closeMenu}
      >
        <Menu
          canInstall={canInstall}
          onClickInstallOnDevice={onClickInstallOnDevice}
        />
      </Overlay>
    </header>
  );
};

export default MenuBar;
