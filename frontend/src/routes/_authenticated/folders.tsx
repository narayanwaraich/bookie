import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/folders")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/folders") {
      throw redirect({
        to: "/bookmarks",
      });
    }
  },
});
