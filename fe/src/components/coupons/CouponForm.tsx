import { CouponEntity } from '@/types/coupon'
import { useState } from 'react'
import { Button } from '../shadcn/ui/button'
import { Textarea } from '../shadcn/ui/textarea'
import { Input } from '../shadcn/ui/input'
import { Label } from '../shadcn/ui/label'
import useStorage from '@/hooks/fetchs/useStorage'
export function CouponForm({
  coupon,
  onSave,
  isEditMode,
  setIsEditMode,
}: {
  coupon: CouponEntity
  onSave: (coupon: CouponEntity) => void
  isEditMode: boolean
  setIsEditMode: (isEditMode: boolean) => void
}) {
  const { uploadFile } = useStorage() // useStorageからuploadFileを取得
  const [formData, setFormData] = useState<CouponEntity>(coupon)
  const [isUploading, setIsUploading] = useState(false) // アップロード状態を管理

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setIsUploading(true)
        // ファイルをアップロードし、アップロード後のURLを取得
        const uploadedUrl = await uploadFile(file)
        // 取得したURLをフォームデータに設定
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }))
        setIsUploading(false)
      } catch (error) {
        console.error('アップロードに失敗しました:', error)
        setIsUploading(false)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // expiration (YYYY-MM-DD) を ISO 8601形式 (YYYY-MM-DDT00:00:00Z) に変換
    const formattedExpiration = new Date(formData.expiration).toISOString()

    // 変換後の expiration を含めてデータを保存
    onSave({ ...formData, expiration: formattedExpiration })
    setIsEditMode(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="uploadImage">画像をアップロードまたはカメラで撮影</Label>
          <Input
            id="uploadImage"
            name="uploadImage"
            type="file"
            accept="image/*"
            capture="environment" // カメラを起動するための属性
            onChange={handleFileChange}
            disabled={!isEditMode || isUploading}
          />
          {isUploading && <p>アップロード中...</p>}
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
        <Button type="submit" className="mt-4" disabled={isUploading}>
          保存
        </Button>
      )}
    </form>
  )
}
