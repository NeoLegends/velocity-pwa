import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { LoginProps } from '../components/login';

import Login from './lazy-login';

// Needs to be `function` because of ambiguity with JSX
// tslint:disable-next-line
const NeedsLogin = function<P>(Comp: React.ComponentType<P>) {
  return (props: P & { isLoggedIn: boolean } & LoginProps & RouteComponentProps) =>
    props.isLoggedIn
      ? <Comp {...(props as any)}/>
      : <Login {...props}/>;
};

export default NeedsLogin;
