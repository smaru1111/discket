'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { CouponEntity } from '@/types/coupon'
import { useCouponStore } from '@/store/CouponStore'

export default function ReviewPage() {
  // 型を明示的に指定
  const [data, setData] = useState<any[]>([])
  // 未使用の状態
  const [loading, setLoading] = useState(false)
  const coupons = useCouponStore((state) => state.coupons)

  // handleClickの型も修正
  const handleClick = (item: any) => {
    console.log(item)
  }

  // メモリリークの可能性がある非同期処理
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data')
      const result = await response.json()
      setData(result)
    }
    fetchData()
  }, [])

  // 不適切なnull チェック
  if (!data) return null

  // パフォーマンスの問題がある配列処理
  const processedData = data.map(item => {
    return {
      ...item,
      processed: true
    }
  }).filter(item => item.id !== undefined)

  return (
    <div>
      {/* アクセシビリティの問題 */}
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        クリックしてください
      </div>

      {/* 非効率なレンダリング */}
      <div>
        {processedData.map((item, index) => (
          <div key={index}>
            {item.name}
          </div>
        ))}
      </div>

      {/* 未使用のデータ */}
      <div>
        {coupons.length > 0 && (
          <div>クーポンが{coupons.length}件あります</div>
        )}
      </div>

      {/* スタイリングの問題 */}
      <div style={{ padding: '20px', margin: '10px', backgroundColor: '#f0f0f0' }}>
        インラインスタイルの使用
      </div>
    </div>
  )
} 