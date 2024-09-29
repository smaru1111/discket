import { CouponEntity } from '@/types/coupon'
import { useState } from 'react'
import { Button } from '../shadcn/ui/button'
import { Textarea } from '../shadcn/ui/textarea'
import { Input } from '../shadcn/ui/input'
import { Label } from '../shadcn/ui/label'

export function CouponForm({
  coupon,
  onSave,
  isEditMode,
}: {
  coupon: CouponEntity
  onSave: (coupon: CouponEntity) => void
  isEditMode: boolean
}) {
  const [formData, setFormData] = useState<CouponEntity>(coupon)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // expiration (YYYY-MM-DD) を ISO 8601形式 (YYYY-MM-DDT00:00:00Z) に変換
    const formattedExpiration = new Date(formData.expiration).toISOString()

    // 変換後の expiration を含めてデータを保存
    onSave({ ...formData, expiration: formattedExpiration })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="imageUrl">画像URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleChange}
            disabled={!isEditMode}
          />
        </div>
        <div>
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            disabled={!isEditMode}
          />
        </div>
        <div>
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            disabled={!isEditMode}
          />
        </div>
        <div>
          <Label htmlFor="expiration">有効期限</Label>
          <Input
            id="expiration"
            name="expiration"
            type="date"
            value={formData.expiration || ''}
            onChange={handleChange}
            disabled={!isEditMode}
          />
        </div>
      </div>
      {isEditMode && (
        <Button type="submit" className="mt-4">
          保存
        </Button>
      )}
    </form>
  )
}
