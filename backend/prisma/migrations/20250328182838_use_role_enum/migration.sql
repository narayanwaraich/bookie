/*
  Warnings:

  - The `permission` column on the `CollectionCollaborator` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `permission` column on the `FolderCollaborator` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CollectionCollaborator" DROP COLUMN "permission",
ADD COLUMN     "permission" "Role" NOT NULL DEFAULT 'VIEW';

-- AlterTable
ALTER TABLE "FolderCollaborator" DROP COLUMN "permission",
ADD COLUMN     "permission" "Role" NOT NULL DEFAULT 'VIEW';
