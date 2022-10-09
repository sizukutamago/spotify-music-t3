/*
  Warnings:

  - Added the required column `image_url` to the `PlayList` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayList_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PlayList" ("createdAt", "id", "roomId", "uri") SELECT "createdAt", "id", "roomId", "uri" FROM "PlayList";
DROP TABLE "PlayList";
ALTER TABLE "new_PlayList" RENAME TO "PlayList";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
