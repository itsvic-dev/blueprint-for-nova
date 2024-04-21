import React, { useState, useEffect } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import PermissionRoute from '@/components/elements/PermissionRoute';
import Can from '@/components/elements/Can';
import Spinner from '@/components/elements/Spinner';
import { useStoreState } from 'easy-peasy';
import { ServerContext } from '@/state/server';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid';

import blueprintRoutes from './routes';

const blueprintExtensions = [...new Set(blueprintRoutes.server.map((route) => route.identifier))];

/**
 * Get the route egg IDs for each extension with server routes.
 */
const useExtensionEggs = () => {
  const [extensionEggs, setExtensionEggs] = useState<{ [x: string]: string[] }>(
    blueprintExtensions.reduce((prev, current) => ({ ...prev, [current]: ['-1'] }), {})
  );

  useEffect(() => {
    (async () => {
      const newEggs: { [x: string]: string[] } = {};
      for (const id of blueprintExtensions) {
        const resp = await fetch(`/api/client/extensions/blueprint/eggs?${new URLSearchParams({ id })}`);
        newEggs[id] = (await resp.json()) as string[];
      }
      setExtensionEggs(newEggs);
    })();
  }, []);

  return extensionEggs;
};

export const NavigationLinks = () => {
  const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
  const serverEgg = ServerContext.useStoreState((state) => state.server.data?.eggId);
  const match = useRouteMatch<{ id: string }>();
  const to = (value: string, url = false) => {
    if (value === '/') {
      return url ? match.url : match.path;
    }
    return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
  };
  const extensionEggs = useExtensionEggs();

  return (
    <>
      {/* Blueprint routes */}
      {blueprintRoutes.server.length > 0 &&
        blueprintRoutes.server
          .filter((route) => !!route.name)
          .filter((route) => (route.adminOnly ? rootAdmin : true))
          .filter((route) =>
            extensionEggs[route.identifier].includes('-1')
              ? true
              : extensionEggs[route.identifier].find((id) => id === serverEgg?.toString())
          )
          .map((route) =>
            route.permission ? (
              <Can key={route.path} action={route.permission} matchAny>
                <NavLink to={to(route.path, true)} exact={route.exact}>
                  <PuzzlePieceIcon />
                  {route.name}
                </NavLink>
              </Can>
            ) : (
              <NavLink key={route.path} to={to(route.path, true)} exact={route.exact}>
                <PuzzlePieceIcon />
                {route.name}
              </NavLink>
            )
          )}
    </>
  );
};

export const NavigationRouter = () => {
  const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
  const serverEgg = ServerContext.useStoreState((state) => state.server.data?.eggId);
  const match = useRouteMatch<{ id: string }>();
  const to = (value: string, url = false) => {
    if (value === '/') {
      return url ? match.url : match.path;
    }
    return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
  };
  const extensionEggs = useExtensionEggs();

  return (
    <>
      {/* Blueprint routes */}
      {blueprintRoutes.server.length > 0 &&
        blueprintRoutes.server
          .filter((route) => (route.adminOnly ? rootAdmin : true))
          .filter((route) =>
            extensionEggs[route.identifier].includes('-1')
              ? true
              : extensionEggs[route.identifier].find((id) => id === serverEgg?.toString())
          )
          .map(({ path, permission, component: Component }) => (
            <PermissionRoute key={path} permission={permission} path={to(path)} exact>
              <Spinner.Suspense>
                <Component />
              </Spinner.Suspense>
            </PermissionRoute>
          ))}
    </>
  );
};
