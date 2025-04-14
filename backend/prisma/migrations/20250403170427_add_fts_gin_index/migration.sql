-- CreateIndex
CREATE INDEX "Bookmark_fullTextSearch_idx" ON "Bookmark" USING GIN ("fullTextSearch");
