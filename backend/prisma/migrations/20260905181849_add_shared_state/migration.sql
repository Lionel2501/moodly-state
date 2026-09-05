-- CreateTable
CREATE TABLE "SharedState" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "stepId" INTEGER NOT NULL,
    "stepName" TEXT NOT NULL,
    "feeling" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedState_code_key" ON "SharedState"("code");
