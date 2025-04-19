import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
// import AuthenticatedLayout from '@/components/features/layout/AuthenticatedLayout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayoutComponent,
});

function AuthenticatedLayoutComponent() {

  return (
    <div className="authenticated-layout">
        <Outlet />
    </div>
  );
}
