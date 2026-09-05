-- AlterTable
ALTER TABLE "MoodState" ADD COLUMN     "aboutUserId" TEXT;

-- CreateIndex
CREATE INDEX "MoodState_aboutUserId_idx" ON "MoodState"("aboutUserId");

-- AddForeignKey
ALTER TABLE "MoodState" ADD CONSTRAINT "MoodState_aboutUserId_fkey" FOREIGN KEY ("aboutUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
