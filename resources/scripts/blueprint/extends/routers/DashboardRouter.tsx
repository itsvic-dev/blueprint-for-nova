import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { PuzzlePieceIcon } from 'heroicons-v2/24/solid';

import blueprintRoutes from './routes';

export const NavigationLinks = () => {
  const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
  return (
    <>
      {/* Blueprint routes */}
      {blueprintRoutes.account.length > 0 &&
        blueprintRoutes.account
          .filter((route) => !!route.name)
          .filter((route) => (route.adminOnly ? rootAdmin : true))
          .map(({ path, name, exact = false }) => (
            <NavLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
              <PuzzlePieceIcon />
              {name}
            </NavLink>
          ))}
    </>
  );
};

export const NavigationRouter = () => {
  const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
  return (
    <>
      {/* Blueprint routes */}
      {blueprintRoutes.account.length > 0 &&
        blueprintRoutes.account
          .filter((route) => (route.adminOnly ? rootAdmin : true))
          .map(({ path, component: Component }) => (
            <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
              <Component />
            </Route>
          ))}
    </>
  );
};
