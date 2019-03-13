import { Link, LinkGetProps } from '@reach/router';
import classNames from 'classnames';
import React, { useContext } from 'react';

import { LanguageContext } from '../resources/language';

import './menu.scss';

export interface MenuEntriesProps {
  canInstall?: boolean;

  onClickInstallOnDevice?: React.MouseEventHandler;
}
export interface MenuProps extends MenuEntriesProps {
  className?: string;
}
interface MenuEntryProps {
  text: string;
  to: string;
}

const calculateClassNames = ({ href, isCurrent, isPartiallyCurrent }: LinkGetProps) => ({
  className: classNames('menu-entry', {
    // Don't show root route as always active
    ['active']: href === '/' ? isCurrent : isPartiallyCurrent,
  }),
});

const MenuEntry: React.FC<MenuEntryProps> = ({ text, to }) => (
  <Link to={to} getProps={calculateClassNames}>
    {text}
  </Link>
);

export const MenuEntries: React.FC<MenuEntriesProps> = ({
  canInstall,
  onClickInstallOnDevice,
}) => {
  const { sw, NAVIGATION } = useContext(LanguageContext);

  return (
    <>
      <MenuEntry text={NAVIGATION.KARTE} to="/"/>
      <MenuEntry text={NAVIGATION.BUCHUNGEN} to="/bookings"/>
      <MenuEntry text={NAVIGATION.ABONNEMENT} to="/tariff"/>
      <MenuEntry text={NAVIGATION.RECHNUNGEN} to="/invoices"/>
      <MenuEntry text={NAVIGATION.ACCOUNT} to="/customer"/>
      <MenuEntry text={NAVIGATION.SUPPORT} to="/support"/>
      <a
        className="menu-entry"
        href="https://www.velocity-aachen.de/imprint.html"
        target="_blank"
      >
        Impressum
      </a>
      {canInstall && (
        <div
          className="menu-entry"
          onClick={onClickInstallOnDevice}
        >
          {sw.INSTALL_TO_DEVICE}
        </div>
      )}
    </>
  );
};

const Menu: React.FC<MenuProps> = ({ className, ...rest }) => (
  <nav className={classNames('menu', className)}>
    <MenuEntries {...rest} />
  </nav>
);

export default Menu;
