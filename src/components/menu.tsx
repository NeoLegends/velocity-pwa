import { Link, LinkGetProps } from '@reach/router';
import classNames from 'classnames';
import React from 'react';

import { LanguageContext } from '../resources/language';

import './menu.scss';

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

const MenuEntry: React.SFC<MenuEntryProps> = ({ text, to }) => (
  <Link to={to} getProps={calculateClassNames}>
    {text}
  </Link>
);

export const MenuEntries: React.FC = () => (
  <LanguageContext.Consumer>
    {({ NAVIGATION }) => (
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
      </>
    )}
  </LanguageContext.Consumer>
);

const Menu: React.FC = () => (
  <nav className="menu">
    <MenuEntries/>
  </nav>
);

export default Menu;
