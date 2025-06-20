import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

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

    const { title, description, category, completed, isPrivate, dueDate } = await request.json()

    const todo = await prisma.todo.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        completedByUser: true
      }
    })

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (category !== undefined) updateData.category = category?.trim() || null
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    
    // Handle completion tracking
    if (completed !== undefined) {
      updateData.completed = completed
      if (completed && !todo.completed) {
        // Marking as complete
        updateData.completedAt = new Date()
        updateData.completedBy = user.id
      } else if (!completed && todo.completed) {
        // Marking as incomplete
        updateData.completedAt = null
        updateData.completedBy = null
      }
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        completedByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ todo: updatedTodo })
  } catch (error) {
    console.error('Update todo error:', error)
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

    const todo = await prisma.todo.findUnique({
      where: { id: params.id }
    })

    if (!todo || todo.userId !== user.id) {
      return NextResponse.json(
        { error: 'Todo not found or access denied' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}