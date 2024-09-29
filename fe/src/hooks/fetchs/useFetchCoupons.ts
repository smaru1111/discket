import { fetchApiWithEnv } from '../useFetchApiWithEnv'

export default function CouponRepository() {
  const fetchCoupons = async () => {
    return fetchApiWithEnv(`/api/coupons`)
  }

  const fetchCoupon = async (id: number) => {
    return fetchApiWithEnv(`/api/coupons?id=${id}`)
  }

  const createCoupon = async (data: any) => {
    return fetchApiWithEnv('/api/coupons/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const updateCoupon = async (data: any) => {
    return fetchApiWithEnv(`/api/coupons?id=${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  const deleteCoupon = async (id: number) => {
    return fetchApiWithEnv(`/api/coupons?id=${id}`, {
      method: 'DELETE',
    })
  }

  return {
    fetchCoupons,
    fetchCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  }
}
