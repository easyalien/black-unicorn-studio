import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Get email and password from command line arguments
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('Usage: npm run db:seed <email> <password>')
    process.exit(1)
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.error(`User with email ${email} already exists`)
    process.exit(1)
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  })

  console.log(`User created successfully:`)
  console.log(`Email: ${user.email}`)
  console.log(`ID: ${user.id}`)
  console.log(`Created: ${user.createdAt}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })