import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/lib/schemas/auth";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signUpSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: validatedData.phone }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        phone: validatedData.phone,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        isPhoneVerified: false // Will be verified via SMS later
      },
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach(err => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });
      return NextResponse.json(
        {
          error: "Validation failed",
          errors: fieldErrors
        },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
