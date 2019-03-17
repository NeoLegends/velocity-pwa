// tslint:disable:ordered-imports

import 'modern-normalize/modern-normalize.css';
import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

declare global {
  interface Number {
    toEuro(): string;
  }

  interface BeforeInstallProptEvent extends Event {
    userChoice: Promise<{ outcome: 'accepted' | unknown }>;

    prompt: () => void;
  }
}

/** Format a number as euro currency. */
Number.prototype.toEuro = function() {
  return this.toLocaleString(undefined, {
    currency: 'EUR',
    style: 'currency',
  });
};

ReactDOM.render(<App />, document.getElementById('root'));
