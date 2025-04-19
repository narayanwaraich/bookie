import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider,createRouter,ErrorComponent } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import './index.css'
import './App.css'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './lib/auth'

const auth = useAuth()

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      {/* <Spinner /> */}
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    auth: undefined!, // We'll inject this when we render
    queryClient,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider
          router={router}
          defaultPreload="intent"
          context={{
            auth,
          }} />
        {}
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
