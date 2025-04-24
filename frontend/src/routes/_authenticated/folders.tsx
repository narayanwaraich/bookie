import { createFileRoute } from '@tanstack/react-router'

interface Folder {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export const Route = createFileRoute('/_authenticated/folders')({
  component: FoldersComponent,
})


function FoldersComponent() {
  // const { folders } = Route.useLoaderData()
  
  return (
    <>
      {/* <h1>Folders</h1>
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
      )} */}
    </>
  )
}
