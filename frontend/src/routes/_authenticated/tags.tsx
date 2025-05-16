import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tags")({
  component: TagsListComponent,
});

function TagsListComponent() {
  // const tags = Route.useLoaderData(); // Example
  return (
    <div>
      <h1>Tags</h1>
      {/* {JSON.stringify(tags)} */}
    </div>
  );
}
