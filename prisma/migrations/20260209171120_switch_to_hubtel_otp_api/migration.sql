-- AlterTable: Remove old OTP fields and add Hubtel requestId fields
ALTER TABLE "users" DROP COLUMN "otpCode";
ALTER TABLE "users" DROP COLUMN "otpExpiresAt";
ALTER TABLE "users" DROP COLUMN "otpAttempts";
ALTER TABLE "users" ADD COLUMN "otpRequestId" TEXT;
ALTER TABLE "users" ADD COLUMN "otpRequestIdExpiresAt" TIMESTAMP(3);
