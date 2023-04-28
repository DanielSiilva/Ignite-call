import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

// Precisamos definir qual o metodo que a requisição vai aceitar, senão aceita qualquer tipo de requisição ;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  // realiazando busca no banco de dados: verificando se o user já existe
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'Username already taken.',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  // Todo cookie precisa de uma data de expiraçaõ. Podemos passar de duas forma => expires e maxAge
  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res.status(201).json(user)
}
