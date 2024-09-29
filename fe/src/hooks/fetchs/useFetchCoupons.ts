import { useCouponStore } from '@/store/CouponStore'
import { fetchApiWithEnv } from '../useFetchApiWithEnv'
import { enqueueSnackbar } from 'notistack'

export default function useFetchCoupons() {
  const setStoreCoupons = useCouponStore((state) => state.setStoreCoupons)
  const addStoreCoupon = useCouponStore((state) => state.addStoreCoupon)
  const updateStoreCoupon = useCouponStore((state) => state.updateStoreCoupon)
  const deleteStoreCoupon = useCouponStore((state) => state.deleteStoreCoupon)

  const fetchCoupons = async () => {
    try {
      const coupons = await fetchApiWithEnv(`/api/coupons`)
      setStoreCoupons(coupons)
      enqueueSnackbar('クーポンの取得に成功しました', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar('クーポンの取得に失敗しました', { variant: 'error' })
      throw err
    }
  }

  const fetchCoupon = async (id: number) => {
    try {
      const coupon = await fetchApiWithEnv(`/api/coupons?id=${id}`)
      return coupon
    } catch (err) {
      enqueueSnackbar('クーポンの取得に失敗しました', { variant: 'error' })
      throw err
    }
  }

  const createCoupon = async (data: any) => {
    try {
      const newCoupon = await fetchApiWithEnv('/api/coupons/', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      addStoreCoupon(newCoupon)
      enqueueSnackbar('クーポンの作成に成功しました', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar('クーポンの作成に失敗しました', { variant: 'error' })
      throw err
    }
  }

  const updateCoupon = async (data: any) => {
    try {
      const updatedCoupon = await fetchApiWithEnv(`/api/coupons?id=${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      updateStoreCoupon(updatedCoupon)
      enqueueSnackbar('クーポンの更新に成功しました', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar('クーポンの更新に失敗しました', { variant: 'error' })
      throw err
    }
  }

  const deleteCoupon = async (id: number) => {
    try {
      await fetchApiWithEnv(`/api/coupons?id=${id}`, {
        method: 'DELETE',
      })
      deleteStoreCoupon(id)
      enqueueSnackbar('クーポンの削除に成功しました', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar('クーポンの削除に失敗しました', { variant: 'error' })
      throw err
    }
  }

  return {
    fetchCoupons,
    fetchCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  }
}
