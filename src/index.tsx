import 'modern-normalize/modern-normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import './index.scss';
import * as serviceWorker from './serviceWorker';

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
