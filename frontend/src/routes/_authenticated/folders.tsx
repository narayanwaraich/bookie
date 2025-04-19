import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'

interface Folder {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export const Route = createFileRoute('/_authenticated/folders')({
  loader: async () => {
    // Example validation - you can replace this with your actual validation logic
    const isAuthenticated = true // Replace with your auth check
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/folders'
        }
      })
    }

    // Fetch and validate folders data
    const folders = await fetchFolders()

    return {
      folders
    }
  },
  component: RouteComponent,
})

// Example data fetching function - replace with your actual implementation
async function fetchFolders(): Promise<Folder[]> {
  // Implement your data fetching logic here
  return []
}

function RouteComponent() {
  const { folders } = Route.useLoaderData()
  
  return (
    <div>
      <h1>Folders</h1>
      {folders.length === 0 ? (
        <p>No folders found</p>
      ) : (
        <ul>
          {folders.map((folder) => (
            <li key={folder.id}>
              <h3>{folder.name}</h3>
              {folder.description && <p>{folder.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
