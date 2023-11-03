-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Character" (
    "contentId" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "userUsername" TEXT NOT NULL,
    CONSTRAINT "Character_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestProgression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "characterContentId" BIGINT NOT NULL,
    "quest" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "complete" BOOLEAN NOT NULL,
    CONSTRAINT "QuestProgression_characterContentId_fkey" FOREIGN KEY ("characterContentId") REFERENCES "Character" ("contentId") ON DELETE RESTRICT ON UPDATE CASCADE
);
