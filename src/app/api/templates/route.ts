import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/templates - List all templates
export async function GET() {
  try {
    console.log('📋 Fetching templates...')

    const templates = await db.template.findMany({
      orderBy: { createdAt: 'desc' },
    })

    console.log(`✅ Found ${templates.length} templates`)
    return NextResponse.json(templates)
  } catch (error) {
    console.error('❌ Error fetching templates:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    console.log('📨 POST /api/templates called')

    const body = await request.json()
    console.log('📦 Request parsed')

    const {
      customerName,
      businessName,
      operationalHours,
      status,
      tone,
      category,
      content,
    } = body

    console.log('📝 Destructured body:', {
      businessName,
      category,
      tone,
      hasContent: !!content,
    })

    if (!content) {
      console.error('❌ No content')
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    console.log('💾 Calling db.template.create...')
    const template = await db.template.create({
      data: {
        customerName: customerName || null,
        businessName: businessName || null,
        operationalHours: operationalHours || null,
        status: status || 'open',
        tone: tone || 'formal',
        category: category || 'open',
        content,
      },
    })

    console.log('✅ Template created:', template.id)
    return NextResponse.json(template, { status: 201 })
  } catch (error: any) {
    console.error('❌ CATCH ERROR:', {
      message: error?.message,
      name: error?.name,
      code: error?.code,
      meta: error?.meta,
    })

    return NextResponse.json(
      {
        error: 'Failed to create template',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
