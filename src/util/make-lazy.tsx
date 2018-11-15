import React, { Suspense } from 'react';

// Needs to be `function` because of ambiguity with JSX
const MakeLazy = function<T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
) {
  const Lazy: any = React.lazy(loader);

  const Comp: React.SFC<any> = props => (
    <Suspense fallback={<span>Loading...</span>}>
      <Lazy {...props}/>
    </Suspense>
  );

  return Comp;
};

export default MakeLazy;
