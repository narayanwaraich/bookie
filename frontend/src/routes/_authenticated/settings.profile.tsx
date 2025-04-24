import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: ProfileComponent,
})

function ProfileComponent() {
  return <div>Hello "/_authenticated/settings/profile"!</div>
}
