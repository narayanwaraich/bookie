I have the following core requirements.

--User Management -Registration -Login / Logout -Password Reset -Profile Management ----Bookmark Management -CRUD -Organize into Folders/Tags -Full-text Search -Filter / Sort / Paginate -Fetch Metadata -Bulk operations -Sharing -Cache -Recommendation System --Tag Management -CRUD --Collection / Folder Management -CRUD -Nested Folders -Sharing --Collaboration Management -Share Folders with team members -Set permissions ( view, edit, admin ) --Sync Management -Real-time sync across devices -indexedDB offline support --Import / Export Management -Import from browsers / services -Export ( HTML, CSV, JSON, PDF etc ) --Browser Extension -Add from any webpage -View directly in browser --Cache Management --Sharing Management

 Go into plan mode & looking at my frontend & backend code, what should i implement next in frontend?


- frontend/src/components/layout/SettingsLayout.tsx
- frontend/src/components/layout/PublicLayout.tsx
- frontend/src/components/features/auth/ui/AuthPageLayout.tsx
- frontend/src/components/features/bookmarks/forms/BulkEditBookmarkForm.tsx
- frontend/src/components/features/bookmarks/ui/BookmarkDetailView.tsx
- frontend/src/components/features/bookmarks/ui/BookmarkQuickView.tsx
- frontend/src/components/features/bookmarks/ui/BookmarkMetadataDisplay.tsx
- frontend/src/components/features/bookmarks/bookmark-helpers.ts
- frontend/src/components/features/bookmarks/BookmarkRecommendations.tsx
- frontend/src/components/features/folders/forms/MoveFolderForm.tsx
- frontend/src/components/features/folders/ui/FolderCard.tsx
- frontend/src/components/features/folders/ui/FolderList.tsx
- frontend/src/components/features/folders/ui/FolderPathBreadcrumb.tsx
- frontend/src/components/features/folders/folder-helpers.ts
- frontend/src/components/features/tags/forms/AssignTagToBookmarkForm.tsx
- frontend/src/components/features/tags/forms/TagForm.tsx
- frontend/src/components/features/tags/ui/TagChip.tsx
- frontend/src/components/features/tags/ui/TagDetailView.tsx
- frontend/src/components/features/tags/ui/TaggedBookmarkList.tsx
- frontend/src/components/features/tags/ui/TagList.tsx
- frontend/src/components/features/tags/tag-helpers.ts
- frontend/src/components/features/collections/forms/CollectionForm.tsx
- frontend/src/components/features/collections/ui/CollectionCard.tsx