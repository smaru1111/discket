import { User } from '@prisma/client'

export type UserEntity = Omit<User, 'createdAt' | 'company'>

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'uid' | 'company'>
export type UpdateUserInput = Omit<Partial<User>, 'email' | 'createdAt' | 'company'>