-- AlterTable
ALTER TABLE "saved_searches" ADD COLUMN     "departureDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "notification_subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "savedSearchId" TEXT NOT NULL,
    "regulationAlerts" BOOLEAN NOT NULL DEFAULT true,
    "permitReminders" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "unsubscribeToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_subscriptions_unsubscribeToken_key" ON "notification_subscriptions"("unsubscribeToken");

-- CreateIndex
CREATE UNIQUE INDEX "notification_subscriptions_userId_savedSearchId_key" ON "notification_subscriptions"("userId", "savedSearchId");

-- AddForeignKey
ALTER TABLE "notification_subscriptions" ADD CONSTRAINT "notification_subscriptions_savedSearchId_fkey" FOREIGN KEY ("savedSearchId") REFERENCES "saved_searches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
