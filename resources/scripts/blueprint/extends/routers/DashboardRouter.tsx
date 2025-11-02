import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { PuzzlePieceIcon } from 'heroicons-v2/24/solid';

import blueprintRoutes from './routes';
import { UiBadge } from '@blueprint/ui';

export const NavigationLinks = () => {
  const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
  return (
    <>
      {/* Blueprint routes */}
      {blueprintRoutes.account.length > 0 &&
        blueprintRoutes.account
          .filter((route) => !!route.name)
          .filter((route) => (route.adminOnly ? rootAdmin : true))
          .map(({ path, name, exact = false, adminOnly }) => (
            <NavLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
              <PuzzlePieceIcon />
              {name}
              {adminOnly ? (
                <>
                  <span className={'hidden'}>(</span>
                  <UiBadge>ADMIN</UiBadge>
                  <span className={'hidden'}>)</span>
                </>
              ) : undefined}
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
