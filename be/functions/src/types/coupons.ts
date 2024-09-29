import { coupons } from '@prisma/client'

export type CouponsEntity = Omit<coupons, 'createdAt'>

export type CreateCouponsInput = Omit<coupons, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCouponsInput = Omit<Partial<coupons>, 'createdAt'>
