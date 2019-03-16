import { RouteComponentProps } from '@reach/router';
import React, { Suspense } from 'react';

import LazyLoadFailed from './lazy-load-failed';
import LazySpinner from './spinner';

// Needs to be `function` because of ambiguity with JSX
// tslint:disable-next-line
const MakeLazy = function<P>(
  loader: () => Promise<{ default: React.ComponentType<P> }>,
) {
  const loaderWithFallback = () =>
    loader().catch(err => {
      console.error('Chunk import failed:', err);
      return { default: (LazyLoadFailed as unknown) as React.ComponentType<P> };
    });

  const Lazy = React.lazy(loaderWithFallback);

  const LazyWrapper = React.forwardRef(
    (props: P & RouteComponentProps, ref) => (
      <Suspense fallback={<LazySpinner />}>
        <Lazy ref={ref} {...props as any} />
      </Suspense>
    ),
  );

  return LazyWrapper;
};

export default MakeLazy;
