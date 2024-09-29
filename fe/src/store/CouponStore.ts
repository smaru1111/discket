import { CouponEntity } from '@/types/coupon'
import { StateCreator, create } from 'zustand'

export type StoreCoupon = CouponEntity
export type UpdateStoreCouponInput = Pick<StoreCoupon, 'id'> & Partial<StoreCoupon>
interface CouponSlice {
  coupons: StoreCoupon[]
  getStoreCoupon: (id: number) => StoreCoupon | undefined
  setStoreCoupons: (coupon: StoreCoupon[]) => void
  addStoreCoupon: (coupon: StoreCoupon) => void
  updateStoreCoupon: (coupon: UpdateStoreCouponInput) => void
  deleteStoreCoupon: (id: number) => void
}

const createCouponSlice: StateCreator<CouponSlice> = (set, get) => ({
  coupons: [],
  getStoreCoupon: (id) => get().coupons.find((coupon) => coupon.id === id),
  setStoreCoupons: (coupons: StoreCoupon[]) =>
    set(() => {
      return { coupons }
    }),
  addStoreCoupon: (coupon: StoreCoupon) =>
    set((state) => {
      return state.coupons.find((u) => u.id === coupon.id)
        ? {
            coupons: state.coupons.map((u) =>
              u.id === coupon.id ? Object.assign({}, u, coupon) : u
            ),
          }
        : { coupons: [coupon, ...state.coupons] }
    }),
  updateStoreCoupon: (coupon: UpdateStoreCouponInput) =>
    set((state) => ({
      coupons: state.coupons.map((u) => (u.id === coupon.id ? Object.assign({}, u, coupon) : u)),
    })),
  deleteStoreCoupon: (id: number) =>
    set((state) => ({ coupons: state.coupons.filter((u) => u.id !== id) })),
})

export const useCouponsStore = create<CouponSlice>(createCouponSlice)
