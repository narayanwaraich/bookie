-- CreateIndex
CREATE INDEX "Bookmark_userId_isDeleted_createdAt_idx" ON "Bookmark"("userId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "Bookmark_userId_isDeleted_visitCount_idx" ON "Bookmark"("userId", "isDeleted", "visitCount");

-- CreateIndex
CREATE INDEX "Collection_userId_isDeleted_updatedAt_idx" ON "Collection"("userId", "isDeleted", "updatedAt");

-- CreateIndex
CREATE INDEX "Folder_userId_isDeleted_name_idx" ON "Folder"("userId", "isDeleted", "name");

-- CreateIndex
CREATE INDEX "Tag_userId_isDeleted_name_idx" ON "Tag"("userId", "isDeleted", "name");
