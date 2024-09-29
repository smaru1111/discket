import { HttpRequest, HttpResponseInit } from '@azure/functions'

import {
  updateCoupons,
  deleteCoupons,
  createCoupon,
  getCoupon,
  getCoupons,
} from '../../model/coupons'
import { getQueryParams } from '../../utils/fetchUtils'
import { validateToken } from '../../utils/aadB2C'

export async function GET(req: HttpRequest): Promise<HttpResponseInit> {
  const id = Number(getQueryParams(req.url, 'id'))
  const aadUid = getQueryParams(req.url, 'uid')
  const decodedToken: any = await validateToken(req)
  const decoded_uid = decodedToken.oid
  console.log('aadUid', aadUid)

  if (id) {
    const coupons = await getCoupon(id)
    if (!coupons) {
      // ユーザーが見つからない場合の処理
      return { jsonBody: { error: { message: 'Coupons not found' } }, status: 404 }
    }
    return { jsonBody: coupons }
  } else if (aadUid) {
    // jwtのuidとクエリパラメータのuidが一致するか確認
    if (decoded_uid === aadUid) {
      const coupons = await getCoupons(aadUid)
      return { jsonBody: coupons }
    } else {
      return { jsonBody: 'Unauthorized', status: 401 }
    }
  } else {
    return { jsonBody: 'Invalid query', status: 400 }
  }
}

export async function POST(req: HttpRequest): Promise<HttpResponseInit> {
  const body = (await req.json()) as any
  const aadUid = body.aadUid
  const decodedToken: any = await validateToken(req)
  // jwtのuidとbodyのuidが一致するか確認
  if (decodedToken.oid === aadUid) {
    const coupons = await createCoupon(body)
    return { jsonBody: coupons }
  } else {
    return { jsonBody: 'Unauthorized', status: 401 }
  }
}

export async function PUT(req: HttpRequest): Promise<HttpResponseInit> {
  const id = Number(getQueryParams(req.url, 'id'))

  if (!id) {
    return { jsonBody: 'Invalid query', status: 400 }
  }
  const body = (await req.json()) as any
  const updateValues = {
    name: body.name,
    imageUrl: body.imageUrl,
    description: body.description,
    expiration: body.expiration,
  }
  const coupons = await updateCoupons(id, updateValues)
  return { jsonBody: coupons }
}

export async function DELETE(req: HttpRequest): Promise<HttpResponseInit> {
  const data: any = await req.json()
  if (!data.ids) {
    return { jsonBody: 'prompt is required', status: 400 }
  }

  const res = await deleteCoupons(data.ids)
  return { jsonBody: res }
}
