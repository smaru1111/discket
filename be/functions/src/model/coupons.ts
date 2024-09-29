import prisma from '../utils/prisma'
import { CreateCouponsInput, UpdateCouponsInput } from '../types/coupons'

export const getCoupons = async (aad_uid: string) => {
  return prisma.coupons.findMany({
    where: {
      aad_uid,
    },
  })
}

export const getCoupon = async (id: number) => {
  const coupons = await prisma.coupons.findUnique({
    where: {
      id,
    },
  })

  if (!coupons) throw new Error('Coupons not found')
  return coupons
}

// ユーザーを作成する
export const createCoupon = async (data: CreateCouponsInput) => {
  const coupons = await prisma.coupons.create({
    data: data,
  })

  return coupons
}

export const createCoupons = async (data: CreateCouponsInput[]) => {
  const coupons = await prisma.coupons.createMany({
    data,
  })
  return coupons
}

// ユーザー情報を更新する
export const updateCoupons = async (id: number, data: UpdateCouponsInput) => {
  const coupons = await prisma.coupons.update({
    where: {
      id,
    },
    data: data,
  })
  return coupons
}

// ユーザーを削除する
export const deleteCoupons = async (ids: number[]) => {
  if (!ids) throw new Error('prompt is required') // idsがundifinedの場合、全件削除されるので二段階でチェック
  const coupons = await prisma.coupons.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })
  if (!coupons) throw new Error('Coupons not found')
  return 'ok'
}
