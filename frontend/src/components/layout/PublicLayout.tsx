import type { ReactNode } from "react";

interface PublicAppLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicAppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/*
        Optional: A public header could go here, e.g., for a landing page.
        <header className="p-4 border-b">
          <img src="/src/assets/logo.png" alt="Bookie Logo" className="h-8" />
        </header>
      */}
      <main className="flex-1 flex items-center justify-center p-4">
        {/*
          The <Outlet /> from the (public)/_layout.tsx route will render its children here.
          This is typically where login, register, forgot password forms will appear.
        */}
        {children}
      </main>
      {/*
        Optional: A public footer could go here.
        <footer className="p-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Bookie App. All rights reserved.
        </footer>
      */}
    </div>
  );
}
