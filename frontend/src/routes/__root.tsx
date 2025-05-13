import { createRootRouteWithContext , Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from "@/components/ui/sonner"
import type { AuthContext } from '@/lib/auth';
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
      {/* <h1>Root Component</h1> */}
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right"/>
    </>
  );
}
