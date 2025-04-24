import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/collections')({
  component: CollectionsListComponent,
});

function CollectionsListComponent() {
  return (
    <>
      <h1>Collections</h1>
    </>
  );
}
