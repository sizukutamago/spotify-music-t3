-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "played" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayList_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PlayList" ("createdAt", "id", "image_url", "name", "roomId", "uri") SELECT "createdAt", "id", "image_url", "name", "roomId", "uri" FROM "PlayList";
DROP TABLE "PlayList";
ALTER TABLE "new_PlayList" RENAME TO "PlayList";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
