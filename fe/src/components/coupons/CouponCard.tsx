import { Edit, Trash2 } from 'lucide-react'
import { CouponEntity } from '@/types/coupon'
import { CouponForm } from './CouponForm'
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '../shadcn/ui/alert-dialog'
import { Button } from '../shadcn/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../shadcn/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../shadcn/ui/dialog'

export function CouponCard({
  coupon,
  isEditMode,
  setIsEditMode,
  onSave,
  onEdit,
  onDelete,
}: {
  coupon: CouponEntity
  isEditMode: boolean
  setIsEditMode: (isEditMode: boolean) => void
  onSave: (coupon: CouponEntity) => void
  onEdit: (coupon: CouponEntity) => void
  onDelete: (id: number | null) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{coupon.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={coupon.imageUrl} alt={coupon.name} className="w-full h-32 object-cover mb-2" />
        <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
        <p className="text-sm">有効期限: {coupon.expiration}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => onEdit(coupon)}>
              <Edit className="mr-2 h-4 w-4" /> 編集
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>割引券を編集</DialogTitle>
            </DialogHeader>
            <CouponForm coupon={coupon} onSave={onSave} isEditMode={true} />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> 削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。本当にこの割引券を削除しますか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(coupon.id)}>削除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
