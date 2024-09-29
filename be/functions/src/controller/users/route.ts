import { getQueryParams } from '../../utils/fetchUtils'
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../../model/user'
import { HttpRequest, HttpResponseInit } from '@azure/functions'

export async function GET(req: HttpRequest): Promise<HttpResponseInit> {
  try {
    const id = Number(getQueryParams(req.url, 'id'))

    if (id) {
      const user = await getUser(id)
      if (!user) {
        // ユーザーが見つからない場合の処理
        return { jsonBody: { error: { message: 'User not found' } }, status: 404 }
      }
      return { jsonBody: user }
    } else {
      const users = await getUsers()
      return { jsonBody: users }
    }
  } catch (error) {
    // 予期せぬエラーのハンドリング
    return { jsonBody: error, status: 500 }
  }
}

export async function POST(req: HttpRequest): Promise<HttpResponseInit> {
  const body = (await req.json()) as any
  const user = await createUser(body)
  return { jsonBody: user }
}

export async function PUT(req: HttpRequest): Promise<HttpResponseInit> {
  const id = Number(getQueryParams(req.url, 'id'))

  if (!id) {
    return { jsonBody: 'Invalid query', status: 400 }
  }
  const body = (await req.json()) as any
  const updateValues = {
    name: body.name,
  }
  const user = await updateUser(id, updateValues)
  return { jsonBody: user }
}

export async function DELETE(req: HttpRequest): Promise<HttpResponseInit> {
  const id = Number(getQueryParams(req.url, 'id'))

  if (!id) {
    return { jsonBody: { error: { message: 'Invalid query' } }, status: 400 }
  }
  const user = await deleteUser(id)
  return { jsonBody: user }
}
