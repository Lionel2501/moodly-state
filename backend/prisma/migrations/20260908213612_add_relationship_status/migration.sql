-- CreateTable
CREATE TABLE "RelationshipStatus" (
    "id" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "aboutUserId" TEXT NOT NULL,

    CONSTRAINT "RelationshipStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RelationshipStatus_userId_idx" ON "RelationshipStatus"("userId");

-- CreateIndex
CREATE INDEX "RelationshipStatus_aboutUserId_idx" ON "RelationshipStatus"("aboutUserId");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipStatus_userId_aboutUserId_key" ON "RelationshipStatus"("userId", "aboutUserId");

-- AddForeignKey
ALTER TABLE "RelationshipStatus" ADD CONSTRAINT "RelationshipStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationshipStatus" ADD CONSTRAINT "RelationshipStatus_aboutUserId_fkey" FOREIGN KEY ("aboutUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
