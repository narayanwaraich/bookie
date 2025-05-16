import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bookmarkParamsSchema = z.object({ bookmarkId: z.string().uuid() });

export const Route = createFileRoute("/_authenticated/bookmarks/$bookmarkId")({
  component: BookmarkDetailComponent,
  loader: async ({ params }) => {
    const validatedParams = bookmarkParamsSchema.parse(params);
  },
  errorComponent: ({ error }) => (
    <div>Error loading bookmark: {error.message}</div>
  ),
});

function BookmarkDetailComponent() {
  const { bookmarkId } = Route.useParams();

  return (
    <div>
      <p>Viewing/Editing Bookmark ID: {bookmarkId}</p>
    </div>
  );
}
