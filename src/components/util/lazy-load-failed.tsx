import classNames from 'classnames';
import React, { useContext } from 'react';

import { LanguageContext } from '../../resources/language';

import './lazy-load-failed.scss';
import Overlay from './overlay';

interface LazyLoadFailedProps {
  className?: string;
}

const LazyLoadFailed: React.FC<LazyLoadFailedProps> = ({ className }) => {
  const { sw } = useContext(LanguageContext);

  return (
    <Overlay isOpen>
      <div className={classNames('lazy-load-failed', className)}>
        <h1>{sw.LOAD_FAILED.TITLE}</h1>
        <p>{sw.LOAD_FAILED.BODY}</p>
      </div>
    </Overlay>
  );
};

export default LazyLoadFailed;
