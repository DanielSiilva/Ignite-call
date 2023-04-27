import { PrismaClient } from '@prisma/client'

//Prima vai entender qual a conexão com o banco de dados a partir do .env

export const prisma = new PrismaClient({
  log: ['query'],
})
