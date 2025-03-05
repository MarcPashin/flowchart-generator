import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        preferences: {
          theme: 'dark',
          flowChartColors: {
            default: '#FFDC62'
          }
        }
      },
    });
    
    // Return success without exposing the password
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}