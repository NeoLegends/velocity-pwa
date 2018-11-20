import { Link, LinkGetProps } from '@reach/router';
import classNames from 'classnames';
import React from 'react';

import withOverlay from '../util/overlay';

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
  <>
    <MenuEntry text="Karte" to="/"/>
    <MenuEntry text="Buchungen" to="/bookings"/>
    <MenuEntry text="Tarif" to="/tariff"/>
    <MenuEntry text="Rechnungen" to="/invoices"/>
    <MenuEntry text="Persönliche Daten" to="/customer"/>
    <MenuEntry text="Support" to="/support"/>
    <a
      className="menu-entry"
      href="https://www.velocity-aachen.de/imprint.html"
      target="_blank"
    >
      Impressum
    </a>
  </>
);

const Menu: React.FC = () => (
  <nav className="menu">
    <MenuEntries/>
  </nav>
);

export default Menu;
