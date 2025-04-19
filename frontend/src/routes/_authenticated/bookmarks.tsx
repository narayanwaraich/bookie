import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/bookmarks')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Bookmarks</h1>
    </div>
  )
}
