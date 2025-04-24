import { createRootRouteWithContext , Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { AuthContext } from '@/lib/auth'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '../../../backend/src/trpc/router';
import type { QueryClient } from '@tanstack/react-query'


interface MyRouterContext {
  auth: AuthContext
  trpc: TRPCOptionsProxy<AppRouter>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>() ({
  component: RootComponent,
  notFoundComponent: () => <div>Not Found - Global</div>, 
});

function RootComponent() {

  return (
    <>
      <Outlet />      
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
