import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// import { Link } from '@tanstack/react-router'; // If you need a logo link

interface AuthPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode; // For "Don't have an account?" links etc.
}

export function AuthPageLayout({
  title,
  description,
  children,
  footerContent,
}: AuthPageLayoutProps) {
  return (
    <div className="w-full max-w-md">
      {/* Optional: Logo or App Name above the card
      <div className="mb-6 text-center">
        <Link to="/" className="inline-block">
          <img src="/src/assets/logo.png" alt="Bookie Logo" className="h-10 mx-auto" />
        </Link>
      </div>
      */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footerContent && (
          // CardFooter might add extra padding, so using a div directly in CardContent
          // or a custom styled footer area might be preferred.
          // For now, placing it inside CardContent with some margin.
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footerContent}
          </div>
        )}
      </Card>
    </div>
  );
}
