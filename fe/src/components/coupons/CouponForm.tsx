import { CouponEntity } from '@/types/coupon'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'
import { Button } from '../shadcn/ui/button'
import { Textarea } from '../shadcn/ui/textarea'
import { Input } from '../shadcn/ui/input'

export function CouponForm({
  coupon,
  onSave,
  isEditMode,
}: {
  coupon: CouponEntity | null
  onSave: (coupon: CouponEntity) => void
  isEditMode: boolean
}) {
  const [formData, setFormData] = useState(
    coupon || { id: 0, imageUrl: '', name: '', description: '', expiration: '', aad_uid: 'user1' }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="imageUrl">画像URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            disabled={!isEditMode}
          />
        </div>
        <div>
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditMode}
          />
        </div>
        <div>
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
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
            value={formData.expiration}
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
