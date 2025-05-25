// src/routes/_authenticated/bookmarks.$bookmarkId.tsx
import { createFileRoute } from "@tanstack/react-router"; // Added useParams
import { z } from "zod";
import { BookmarkDetailView } from "@/components/features/bookmarks/ui/BookmarkDetailView";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay"; // For error component

const bookmarkParamsSchema = z.object({ bookmarkId: z.string().uuid() });

export const Route = createFileRoute("/_authenticated/bookmarks/$bookmarkId")({
  parseParams: (params) => bookmarkParamsSchema.parse(params), // Ensure params are validated
  component: BookmarkDetailPage,
  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Error"
      message={`Error loading bookmark: ${error.message}`}
    />
  ),
});

function BookmarkDetailPage() {
  // useParams from TanStack Router is better here as it's type-safe with parseParams
  const { bookmarkId } = Route.useParams();
  return <BookmarkDetailView bookmarkId={bookmarkId} />;
}
