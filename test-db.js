const { PrismaClient } = require('@prisma/client')
const path = require('path')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:/home/z/my-project/db/custom.db'
    }
  }
})

async function test() {
  try {
    console.log('🔍 Testing database connection...')

    // Test 1: Connect
    await prisma.$connect()
    console.log('✅ Database connected')

    // Test 2: Count templates
    const count = await prisma.template.count()
    console.log(`📊 Templates in database: ${count}`)

    // Test 3: Create test template
    console.log('📝 Creating test template...')
    const testTemplate = await prisma.template.create({
      data: {
        customerName: 'Test User',
        businessName: 'Test Business',
        operationalHours: '9AM-5PM',
        status: 'open',
        tone: 'formal',
        category: 'open',
        content: 'This is a test template content'
      }
    })
    console.log('✅ Test template created:', testTemplate.id)

    // Test 4: Delete test template
    await prisma.template.delete({
      where: { id: testTemplate.id }
    })
    console.log('🗑️ Test template deleted')

    console.log('\n✅ All database tests passed!')
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

test()
