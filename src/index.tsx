import 'react-app-polyfill/ie11.js';

import 'modern-normalize/modern-normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import './index.scss';

declare global {
  interface Number {
    toEuro(): string;
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
