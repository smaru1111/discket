import { User } from '@prisma/client'
import prisma from '../utils/prisma'

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserInput = Omit<Partial<User>, 'createdAt'>

export const getUsers = async () => {
  return prisma.user.findMany()
}

export const getUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) throw new Error('User not found')
  return user
}

// ユーザーを作成する
export const createUser = async (data: CreateUserInput) => {
  const user = await prisma.user.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  return user
}

// ユーザー情報を更新する
export const updateUser = async (id: number, data: UpdateUserInput) => {
  const user = prisma.user.update({
    where: {
      id,
    },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
  return user
}

// ユーザーを削除する
export const deleteUser = async (id: number) => {
  const user = prisma.user.delete({
    where: {
      id,
    },
  })
  return user
}