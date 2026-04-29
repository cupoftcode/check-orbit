-- CreateTable
CREATE TABLE "destination_subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryCodes" TEXT[],
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribeToken" TEXT NOT NULL,

    CONSTRAINT "destination_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destination_subscriptions_unsubscribeToken_key" ON "destination_subscriptions"("unsubscribeToken");

-- CreateIndex
CREATE UNIQUE INDEX "destination_subscriptions_email_key" ON "destination_subscriptions"("email");
