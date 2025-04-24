import { createFileRoute, Outlet } from '@tanstack/react-router';

// Placeholder for a public-specific layout component (optional)
// import PublicLayout from '@/components/features/layout/PublicLayout';

export const Route = createFileRoute('/(public)/_layout')({
  component: PublicLayoutComponent,
});

function PublicLayoutComponent() {
  return (
    <div className="public-layout"> 
      {/* <PublicLayout> */}
        <Outlet />
      {/* </PublicLayout> */}
    </div>
  );
}
