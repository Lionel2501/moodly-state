-- CreateIndex
CREATE UNIQUE INDEX "MoodState_userId_aboutUserId_key" ON "MoodState"("userId", "aboutUserId");
