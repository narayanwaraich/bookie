import { useMutation, useQuery } from '@tanstack/react-query';
import { trpc } from '../../../lib/api';

export default function BookmarksList() {
  const bookmarkQuery = useQuery(trpc.bookmarks.getById.queryOptions({ id: 'id_bilbo' }));
  const bookmarkCreator = useMutation(trpc.bookmarks.create.mutationOptions());
  return (
    <div>
      <p>{bookmarkQuery.data?.name}</p>
      <button onClick={() => bookmarkCreator.mutate({ url: 'Frodo' })}>
        Create Frodo
      </button>
    </div>
  );
}