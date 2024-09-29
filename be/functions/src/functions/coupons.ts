import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { GET, POST, PUT, DELETE } from '../controller/coupons/route'

export async function coupons(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`🔥🔥httpTriggerCouponsが発火🔥🔥`, request?.body)
  if (request.method === 'GET') {
    return await GET(request)
  } else if (request.method === 'POST') {
    return await POST(request)
  } else if (request.method === 'PUT') {
    return await PUT(request)
  } else if (request.method === 'DELETE') {
    return await DELETE(request)
  } else {
    return {
      status: 405,
      body: 'Method Not Allowed',
    }
  }
}

app.http('coupons', {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  authLevel: 'anonymous',
  handler: coupons,
})
