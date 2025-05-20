import { createFileRoute } from "@tanstack/react-router";
import CollectionsListComponent from "@/components/features/collections/CollectionListView";

export const Route = createFileRoute("/_authenticated/collections")({
  component: CollectionsListComponent,
});
