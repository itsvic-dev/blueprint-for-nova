import { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import { ServerContext } from '@/state/server';

import blueprintRoutes from './routes';
import { BPServerRouteDefinition } from '@/routers/bpRouteTypes';

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

export const useBlueprintServerRoutes = (): BPServerRouteDefinition[] => {
  const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
  const serverEgg = ServerContext.useStoreState((state) => state.server.data?.eggId);
  const extensionEggs = useExtensionEggs();
  return blueprintRoutes.server
    .filter((route) => (route.adminOnly ? rootAdmin : true))
    .filter((route) =>
      extensionEggs[route.identifier].includes('-1')
        ? true
        : extensionEggs[route.identifier].find((id) => id === serverEgg?.toString())
    );
};
