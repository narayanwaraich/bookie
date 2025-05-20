import { createFileRoute } from "@tanstack/react-router";
import TagsListComponent from "@/components/features/tags/TagListView";

export const Route = createFileRoute("/_authenticated/tags")({
  component: TagsListComponent,
});
