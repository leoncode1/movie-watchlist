-- CreateEnum
CREATE TYPE "WatchListStatus" AS ENUM ('PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "releaseYear" INTEGER NOT NULL,
    "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "runtime" INTEGER,
    "posterUrl" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "status" "WatchListStatus" NOT NULL DEFAULT 'PLANNED',
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "watchlistItem_userId_movieId_key" ON "watchlistItem"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlistItem" ADD CONSTRAINT "watchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlistItem" ADD CONSTRAINT "watchlistItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
