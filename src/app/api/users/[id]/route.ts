import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { UserRole } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        title: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdTodos: true
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: targetUser })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Access denied. Superuser required.' },
        { status: 403 }
      )
    }

    const { email, password, firstName, lastName, title, role } = await request.json()

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if email is already taken by another user
    const emailExists = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        id: { not: params.id }
      }
    })

    if (emailExists) {
      return NextResponse.json(
        { error: 'Email is already taken by another user' },
        { status: 400 }
      )
    }

    const updateData: any = {
      email: email.trim().toLowerCase()
    }

    // Only update password if provided
    if (password?.trim()) {
      updateData.password = await hashPassword(password)
    }

    // Update name fields
    if (firstName !== undefined) {
      updateData.firstName = firstName?.trim() || null
    }
    if (lastName !== undefined) {
      updateData.lastName = lastName?.trim() || null
    }
    if (title !== undefined) {
      updateData.title = title?.trim() || null
    }

    // Only update role if provided
    if (role) {
      updateData.role = role
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        title: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (user.role !== 'SUPERUSER') {
      return NextResponse.json(
        { error: 'Access denied. Superuser required.' },
        { status: 403 }
      )
    }

    // Prevent user from deleting themselves
    if (user.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user and cascade delete their todos
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}