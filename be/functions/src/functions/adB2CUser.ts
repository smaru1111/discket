import { cca, tokenRequest, validateToken } from '../utils/aadB2C'
import { getQueryParams, errorHandler } from '../utils/fetchUtils'
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

export async function adB2CUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`)

  try {
    const uid: any = getQueryParams(request.url, 'uid')
    const decodedToken: any = await validateToken(request)
    const decodedUid = decodedToken.oid
    if (uid !== decodedUid) {
      return {
        status: 401,
        body: 'Unauthorized',
      }
    }
    const res: any = await cca.acquireTokenByClientCredential(tokenRequest)
    const accessToken = res.accessToken
    const fetchUserRes = await fetch('https://graph.microsoft.com/v1.0/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const fetchUserResJson = await fetchUserRes.json()
    const users = fetchUserResJson.value

    const user = users.find((user: any) => user.id === uid)

    return { jsonBody: user }
  } catch (e: any) {
    return errorHandler(e)
  }
}

app.http('adB2CUser', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: adB2CUser,
})
