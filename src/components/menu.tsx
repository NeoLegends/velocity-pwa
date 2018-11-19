import { Link } from '@reach/router';
import classNames from 'classnames';
import React from 'react';

import withOverlay from '../util/overlay';

import './menu.scss';

interface MenuEntryProps {
  text: string;
  to: string;
}

const calculateClassNames = ({ isCurrent }) => ({
  className: classNames('menu-entry', { ['active']: isCurrent }),
});

const MenuEntry: React.SFC<MenuEntryProps> = ({ text, to }) => (
  <Link to={to} getProps={calculateClassNames}>
    {text}
  </Link>
);

const Menu: React.FC = () => (
  <nav className="menu">
    <MenuEntry text="Karte" to="/"/>
    <MenuEntry text="Buchungen" to="/bookings"/>
    <MenuEntry text="Tarif" to="/tariff"/>
    <MenuEntry text="Rechnungen" to="/invoices"/>
    <MenuEntry text="Persönliche Daten" to="/personal-data"/>
    <MenuEntry text="Support" to="/support"/>
    <MenuEntry text="Impressum" to="/impressum"/>
  </nav>
);

export default withOverlay(Menu);
