import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { linkOrderToUser } from "@/app/actions/orders";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, phone, name, address } = body;

    // Validate input
    if (!orderId || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Phone number already registered" },
        { status: 400 }
      );
    }

    // Parse name
    const nameParts = name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Create user account
    const user = await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        isPhoneVerified: true, // Auto-verify since they completed order
        phoneVerifiedAt: new Date()
      }
    });

    // Create address if provided
    if (address) {
      await prisma.address.create({
        data: {
          userId: user.id,
          label: "Home",
          street: address,
          city: "N/A", // Will be updated by user later
          country: "Ghana",
          isDefault: true
        }
      });
    }

    // Link order to user
    await linkOrderToUser(orderId, user.id);

    // Note: Password is not used in this passwordless auth system
    // User can sign in later using OTP to their phone number

    return NextResponse.json({
      success: true,
      message: "Account created successfully"
    });
  } catch (error) {
    logger.error("Save guest order error", error);
    return NextResponse.json(
      { success: false, message: "Failed to create account" },
      { status: 500 }
    );
  }
}
