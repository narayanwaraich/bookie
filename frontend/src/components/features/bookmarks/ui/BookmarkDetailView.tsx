import { Route } from "@/routes/_authenticated/bookmarks.$bookmarkId";

export default function BookmarkDetail() {
  const { bookmarkId } = Route.useParams();

  return (
    <div>
      <p>Viewing/Editing Bookmark ID: {bookmarkId}</p>
    </div>
  );
}
