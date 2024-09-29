'use client'

import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { CouponCard } from '@/components/coupons/CouponCard'
import { Button } from '@/components/shadcn/ui/button'
import { DialogHeader } from '@/components/shadcn/ui/dialog'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { CouponEntity } from '@/types/coupon'
import { CouponForm } from '@/components/coupons/CouponForm'
import { useAuthStore } from '@/store/AuthStore'
import { useCouponStore } from '@/store/CouponStore'
import useFetchCoupons from '@/hooks/fetchs/useFetchCoupons'
import { enqueueSnackbar } from 'notistack'

export default function CouponManagement() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<CouponEntity | null>(null)
  const me = useAuthStore((state) => state.me)
  const coupons = useCouponStore((state) => state.coupons)
  const { createCoupon, deleteCoupon, updateCoupon, fetchCoupon, fetchCoupons } = useFetchCoupons()

  const handleCouponAddNew = () => {
    if (!me) throw new Error('User not found')
    setSelectedCoupon({
      id: null,
      imageUrl: '',
      name: '',
      description: '',
      expiration: '',
      aad_uid: me.uid,
    })
    setIsEditMode(true)
  }

  const handleCouponEdit = (coupon: CouponEntity) => {
    setSelectedCoupon(coupon)
    setIsEditMode(true)
  }

  const handleCouponSave = (coupon: CouponEntity) => {
    if (coupon.id === null) {
      createCoupon(coupon)
    } else {
      updateCoupon(coupon)
    }
    setSelectedCoupon(null)
    setIsEditMode(false)
  }

  const handleCouponDelete = (id: number | null) => {
    if (!id) {
      enqueueSnackbar('削除に失敗しました', { variant: 'error' })
      throw new Error('Coupon not found')
    } else {
      deleteCoupon(id)
    }
  }

  const fetchCouponsData = async () => {
    await fetchCoupons()
  }
  useEffect(() => {
    fetchCouponsData()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">割引券管理</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleCouponAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> 新しい割引券を追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode
                  ? selectedCoupon?.id === null
                    ? '新しい割引券'
                    : '割引券を編集'
                  : '割引券の詳細'}
              </DialogTitle>
            </DialogHeader>
            <CouponForm coupon={selectedCoupon} onSave={handleCouponSave} isEditMode={isEditMode} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onEdit={handleCouponEdit}
            onDelete={handleCouponDelete}
          />
        ))}
      </div>
    </div>
  )
}
