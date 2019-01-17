import classNames from 'classnames';
import React from 'react';

import { LanguageContext } from '../resources/language';

import './lazy-load-failed.scss';
import Overlay from './overlay';

interface LazyLoadFailedProps {
  className?: string;
}

const LazyLoadFailed: React.FC<LazyLoadFailedProps> = ({ className }) => (
  <LanguageContext.Consumer>
    {({ sw }) => (
      <Overlay isOpen>
        <div className={classNames('lazy-load-failed', className)}>
          <h1>{sw.LOAD_FAILED.TITLE}</h1>
          <p>{sw.LOAD_FAILED.BODY}</p>
        </div>
      </Overlay>
    )}
  </LanguageContext.Consumer>
);

export default LazyLoadFailed;
