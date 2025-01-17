'use client'

import { useEffect, useState } from 'react'
import { PlusCircle, LogOut } from 'lucide-react'
import { CouponCard } from '@/components/coupons/CouponCard'

import { CouponEntity } from '@/types/coupon'
import { CouponForm } from '@/components/coupons/CouponForm'
import { useAuthStore } from '@/store/AuthStore'
import { useCouponStore } from '@/store/CouponStore'
import useFetchCoupons from '@/hooks/fetchs/useFetchCoupons'
import { enqueueSnackbar } from 'notistack'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/ui/dialog'

const defaultCoupon: CouponEntity = {
  id: null,
  imageUrl: '',
  name: '',
  description: '',
  expiration: '',
  aadUid: '',
}

export default function Home() {
  const [selectedCoupon, setSelectedCoupon] = useState<CouponEntity>(defaultCoupon)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const me = useAuthStore((state) => state.me)
  const coupons = useCouponStore((state) => state.coupons)
  const { createCoupon, deleteCoupon, updateCoupon, fetchCoupons } = useFetchCoupons()
  const { getAccount, logout } = useAuth() // ログアウト関数を追加

  const handleCouponAddNew = async () => {
    setSelectedCoupon(defaultCoupon)
  }

  const handleCouponEdit = (coupon: CouponEntity) => {
    console.log('edit coupon', coupon)
    setSelectedCoupon(coupon)
  }

  const handleCouponSave = async (coupon: CouponEntity) => {
    const currentUser = await getAccount()
    console.log('currentUser', currentUser)
    if (!currentUser) {
      enqueueSnackbar('ログインしてください', { variant: 'error' })
      return
    }
    console.log('save coupon', coupon)
    const { id, aadUid, ...rest } = coupon

    if (coupon.id === null) {
      createCoupon({ ...rest, aadUid: currentUser.uid })
      setIsCreateDialogOpen(false)
    } else {
      updateCoupon({ ...rest, id, aadUid: currentUser.uid })
      setIsEditDialogOpen(false)
    }
    setSelectedCoupon(defaultCoupon)
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
    const currentUser = await getAccount()
    console.log('currentUser', currentUser)
    if (!currentUser) {
      enqueueSnackbar('ログインしてください', { variant: 'error' })
      return
    }
    const uid = currentUser.uid

    if (!uid) {
      enqueueSnackbar('ログインしてください', { variant: 'error' })
      return
    }
    await fetchCoupons(uid)
  }

  useEffect(() => {
    fetchCouponsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('secret', process.env.NEXT_PUBLIC_SECRET)

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <div className="text-3xl font-bold">Discket</div>
        <div className="flex items-center space-x-4">
          {me?.name && <span>ようこそ, {me.name} さん</span>}
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> ログアウト
          </Button>
        </div>
      </header>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">割引券管理</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCouponAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> 新しい割引券を追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しい割引券</DialogTitle>
            </DialogHeader>
            <CouponForm
              coupon={selectedCoupon}
              onSave={handleCouponSave}
              isEditMode={isCreateDialogOpen}
              setIsEditMode={setIsCreateDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onSave={handleCouponSave}
            onEdit={handleCouponEdit}
            onDelete={handleCouponDelete}
          />
        ))}
      </div>
    </div>
  )
}
