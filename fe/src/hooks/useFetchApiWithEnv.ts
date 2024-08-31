export const fetchApiWithEnv = async (
  url: string,
  options: Record<string, any> = {},
  isRawOutput?: boolean,
) => {
  const envUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:7071'

  // セッションストレージからトークンを取得
  const sessionKeyStrings =
    sessionStorage.getItem(`msal.token.keys.${process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID}`) ||
    ''
  const sessionKey = JSON.parse(sessionKeyStrings).idToken[0]

  const idTokenStrings = sessionStorage.getItem(sessionKey) || ''
  const idToken = JSON.parse(idTokenStrings).secret

  const { headers, ...rest } = options
  const fetchOptions = {
    ...rest,
    headers: {
      ...headers,
      Authorization: `Bearer ${idToken}`,
    },
  }

  const response = await fetch(envUrl + url, fetchOptions)

  if (isRawOutput) {
    return response
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : {}
}
