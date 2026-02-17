import { NextRequest, NextResponse } from 'next/server'

// Template patterns based on category and tone
const TEMPLATES: Record<string, Record<string, string>> = {
  open: {
    formal: "Dear {{name}},\n\nThank you for contacting {{business}}. We're currently open ({{hours}}) and will respond shortly.\n\nBest regards,\n{{business}} Team",
    'semi-formal': "Hi {{name}},\n\nThanks for reaching out to {{business}}! We're open now ({{hours}}) and someone will get back to you soon.\n\nCheers,\n{{business}}",
    casual: "Hey {{name}}!\n\n{{business}} is open ({{hours}}) - we'll reply ASAP. Thanks for messaging us! 😊",
  },
  closed: {
    formal: "Dear {{name}},\n\nThank you for your message. We're currently closed but will be open during {{hours}}. We'll respond when available.\n\nSincerely,\n{{business}} Team",
    'semi-formal': "Hi {{name}},\n\nWe're closed right now but back open {{hours}}. We'll get back to you as soon as we're back!\n\nThanks,\n{{business}}",
    casual: "Hey {{name}}!\n\n{{business}} is closed now but we'll be back {{hours}}. Catch you then! 👋",
  },
  promo: {
    formal: "Dear Valued Customer,\n\nEnjoy 15% off your next order at {{business}}! Use code: WELCOME15\n\nOffer valid until [date]",
    casual: "Hey there!\n\nGet 15% OFF at {{business}} with code: WELCOME15 🎉\n\nHurry, offer ends soon!",
  },
  confirmation: {
    formal: "Dear {{name}},\n\nYour order #12345 has been confirmed. Expected delivery: [date]\n\nThank you for choosing {{business}}!",
    casual: "Yay {{name}}!\n\nYour order #12345 is confirmed 🚚\n\nExpected delivery: [date]\n\nThanks for shopping with {{business}}!",
  },
  reminder: {
    formal: "Dear {{name}},\n\nThis is a friendly reminder that payment for your order is due. Please complete payment by [date] to avoid cancellation.",
    casual: "Hi {{name}}!\n\nJust a quick reminder: payment for your order is due soon ⏳\n\nComplete payment by [date] to keep your order!",
  },
}

/**
 * Sanitize input to prevent XSS attacks
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Parse template with placeholder replacement
 */
function parseTemplate(template: string, data: Record<string, string>): string {
  const safeData = {
    name: sanitizeInput(data.name || '[Customer Name]'),
    business: sanitizeInput(data.business || '[Business Name]'),
    hours: sanitizeInput(data.hours || '[Operational Hours]'),
  }

  return template.replace(/{{(\w+)}}/g, (match, key) => {
    return safeData[key as keyof typeof safeData] || match
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, businessName, operationalHours, status, tone, category } = body

    // Validate required fields
    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }

    // Get base template based on category and tone
    let template = TEMPLATES[category]?.[tone] || TEMPLATES.open.formal

    // Special case for closed status
    if (category === 'closed' && status === 'open') {
      template = TEMPLATES.open[tone] || TEMPLATES.open.formal
    }

    // Replace placeholders with actual values
    const content = parseTemplate(template, {
      name: customerName || '',
      business: businessName,
      hours: operationalHours || '',
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating template:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}
