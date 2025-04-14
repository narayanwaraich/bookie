-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Bookmark_isDeleted_idx" ON "Bookmark"("isDeleted");
