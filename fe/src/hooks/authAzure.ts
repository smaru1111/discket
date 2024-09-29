import { Configuration } from '@azure/msal-browser'

export let redirectUri: string

if (typeof window !== 'undefined') {
  // window が利用可能な場合、つまりクライアントサイドではリダイレクトURIを設定
  redirectUri = window.location.origin
  console.log('redirectUri', redirectUri)
} else {
  // サーバーサイドでは空の文字列を設定するなど、適切な処理を行います
  redirectUri = ''
}

export const b2cPolicies = {
  authorities: {
    signIn: {
      authority: process.env.NEXT_PUBLIC_AZURE_AD_B2C_AUTHORITY + '_signin' || '',
    },
    signUp: {
      authority: process.env.NEXT_PUBLIC_AZURE_AD_B2C_AUTHORITY + '_signup' || '',
    },
  },
}

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID || '',
    authority: b2cPolicies.authorities.signIn.authority,
    knownAuthorities: [process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME || ''],
    redirectUri: redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const signInRequest = {
  scopes: ['openid'],
  authority: b2cPolicies.authorities.signIn.authority,
  extraQueryParameters: { ui_locales: 'ja' },
}

export const signUpRequest = {
  scopes: ['openid'],
  authority: b2cPolicies.authorities.signUp.authority,
  extraQueryParameters: { ui_locales: 'ja' },
}
