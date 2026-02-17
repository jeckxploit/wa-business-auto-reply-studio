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

    // Check content-type header
    const contentType = request.headers.get('content-type')
    console.log('📋 Content-Type:', contentType)

    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('📦 Request body parsed successfully')
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    console.log('📝 Raw request body:', JSON.stringify(body, null, 2))

    const {
      customerName,
      businessName,
      operationalHours,
      status,
      tone,
      category,
      content,
    } = body

    console.log('📝 Destructured values:', {
      customerName: customerName || '(empty)',
      businessName: businessName || '(empty)',
      operationalHours: operationalHours || '(empty)',
      status: status || '(empty)',
      tone: tone || '(empty)',
      category: category || '(empty)',
      hasContent: !!content,
      contentLength: content?.length,
    })

    // Validate required fields
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      console.error('❌ Validation failed: Content is required and must be a non-empty string')
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Sanitize content (basic sanitization)
    const sanitizedContent = content.trim()

    console.log('💾 Creating template in database...')
    
    let template
    try {
      template = await db.template.create({
        data: {
          customerName: customerName?.trim() || null,
          businessName: businessName?.trim() || null,
          operationalHours: operationalHours?.trim() || null,
          status: status || 'open',
          tone: tone || 'formal',
          category: category || 'open',
          content: sanitizedContent,
        },
      })
    } catch (dbError: any) {
      console.error('❌ Database error:', {
        name: dbError?.name,
        message: dbError?.message,
        code: dbError?.code,
        meta: dbError?.meta,
      })
      throw dbError
    }

    console.log('✅ Template created successfully:', {
      id: template.id,
      businessName: template.businessName,
      contentLength: template.content.length,
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error: any) {
    console.error('❌ POST /api/templates ERROR:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })

    // Handle Prisma-specific errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A template with this unique constraint already exists' },
        { status: 409 }
      )
    }

    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Foreign key constraint failed' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create template',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}
