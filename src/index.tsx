// tslint:disable:ordered-imports

// Import this first to avoid excessive deoptimization because of a
// prototype change in `number`.
import './util/to-euro';

import 'modern-normalize/modern-normalize.css';
import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

declare global {
  interface BeforeInstallProptEvent extends Event {
    userChoice: Promise<{ outcome: 'accepted' | unknown }>;

    prompt: () => void;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
