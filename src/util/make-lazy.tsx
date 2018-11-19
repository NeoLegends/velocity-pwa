import { RouteComponentProps } from '@reach/router';
import React, { Suspense } from 'react';

// Needs to be `function` because of ambiguity with JSX
// tslint:disable-next-line
const MakeLazy = function<P>(loader: () => Promise<{ default: React.ComponentType<P> }>) {
  const Lazy = React.lazy(loader);

  const LazyWrapper: React.SFC<P & RouteComponentProps> = props => (
    <Suspense fallback={<span>Loading...</span>}>
      <Lazy {...(props as any)}/>
    </Suspense>
  );

  return LazyWrapper;
};

export default MakeLazy;
