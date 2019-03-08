import { navigate, Router } from '@reach/router';
import React, { useCallback } from 'react';
import { Slide, ToastContainer } from 'react-toastify';

import { useLogin } from '../hooks/authentication';
import { useLanguage } from '../hooks/intl';
import { useServiceWorker } from '../hooks/sw';
import {
  LanguageContext,
  LanguageIdentifier,
  LanguageIdContext,
} from '../resources/language';
import Login from '../util/lazy-login';
import makeLazy from '../util/make-lazy';
import needsLogin from '../util/needs-login';

import './app.scss';
import MenuBar from './menu-bar';

interface AppBodyProps {
  onChangeLanguage: (lang: LanguageIdentifier) => void;
}

const Bookings = needsLogin(makeLazy(() => import('./bookings')));
const Customer = needsLogin(makeLazy(() => import('./customer/customer')));
const Invoices = needsLogin(makeLazy(() => import('./invoices')));
const Map = makeLazy(() => import('./map/bike-map'));
const Support = needsLogin(makeLazy(() => import('./support')));
const Tariff = needsLogin(makeLazy(() => import('./tariff')));

const AppBody: React.SFC<AppBodyProps> = ({ onChangeLanguage }) => {
  useServiceWorker();

  const { isLoggedIn, login, loginStatusKnown, logout } = useLogin();

  const loginWithRedirect = useCallback(
    (email: string, pw: string) => login(email, pw).then(() => navigate('/')),
    [],
  );
  const handleLoginLogoutButtonClick = useCallback(
    () => isLoggedIn ? logout() : navigate('/login'),
    [isLoggedIn],
  );

  return (
    <div className="app">
      <ToastContainer
        position="bottom-center"
        progressClassName="toast-progress"
        toastClassName="toast outline"
        transition={Slide}
      />

      <MenuBar
        isLoggedIn={isLoggedIn}
        loginStatusKnown={loginStatusKnown}
        onChangeLanguage={onChangeLanguage}
        onLoginButtonClick={handleLoginLogoutButtonClick}
      />

      <Router role="main" className="main">
        <Map path="/" isLoggedIn={isLoggedIn}/>

        <Bookings
          path="/bookings"
          isLoggedIn={isLoggedIn}
          onLoginStart={login}
        />
        <Customer
          path="/customer/*"
          isLoggedIn={isLoggedIn}
          onLoginStart={login}
        />
        <Invoices
          path="/invoices"
          isLoggedIn={isLoggedIn}
          onLoginStart={login}
        />
        <Login path="/login" onLoginStart={loginWithRedirect}/>
        <Support
          path="/support"
          isLoggedIn={isLoggedIn}
          onLoginStart={login}
        />
        <Tariff
          path="/tariff"
          isLoggedIn={isLoggedIn}
          onLoginStart={login}
        />
      </Router>

      <a
        className="unofficial"
        href="https://github.com/NeoLegends/velocity-pwa"
        target="_blank"
      >
        Unofficial version
      </a>
    </div>
  );
};

const App: React.FC = () => {
  const [langId, language, setLanguage] = useLanguage();

  return (
    <LanguageContext.Provider value={language}>
      <LanguageIdContext.Provider value={langId}>
        <AppBody onChangeLanguage={setLanguage}/>
      </LanguageIdContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
