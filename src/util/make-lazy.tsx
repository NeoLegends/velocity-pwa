import { RouteComponentProps } from '@reach/router';
import React, { Suspense } from 'react';

import './make-lazy.scss';

const LazySpinner = (
  <div className="spinner-lazy">
    <div className="lds-ellipsis">
      <div/>
      <div/>
      <div/>
      <div/>
    </div>
  </div>
);

// Needs to be `function` because of ambiguity with JSX
// tslint:disable-next-line
const MakeLazy = function<P>(loader: () => Promise<{ default: React.ComponentType<P> }>) {
  const Lazy = React.lazy(loader);

  const LazyWrapper: React.SFC<P & RouteComponentProps> = props => (
    <Suspense fallback={LazySpinner}>
      <Lazy {...(props as any)}/>
    </Suspense>
  );

  return LazyWrapper;
};

export default MakeLazy;
