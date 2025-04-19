import { createRootRouteWithContext , Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import type { AuthContext } from '@/lib/auth'

interface MyRouterContext {
  auth: AuthContext
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
