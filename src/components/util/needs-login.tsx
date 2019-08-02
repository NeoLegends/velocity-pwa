import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { LoginProps } from '../login';

import Login from './lazy-login';

type AdditionalProps = { isLoggedIn: boolean } & LoginProps &
  RouteComponentProps;

// Needs to be `function` because of ambiguity with JSX
// tslint:disable-next-line
const NeedsLogin = function<P>(Comp: React.ComponentType<P>) {
  const LoginWrapper = React.forwardRef((props: P & AdditionalProps, ref) =>
    props.isLoggedIn ? (
      <Comp ref={ref} {...(props as any)} />
    ) : (
      <Login {...props} />
    ),
  );

  return LoginWrapper;
};

export default NeedsLogin;
