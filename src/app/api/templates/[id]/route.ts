import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE /api/templates/[id] - Delete a specific template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params before destructuring (Next.js 16 requirement)
    const { id } = await params

    // Validate id
    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Check if template exists
    const existingTemplate = await db.template.findUnique({
      where: { id },
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Delete the template
    await db.template.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
