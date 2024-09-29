import { HttpRequest } from '@azure/functions'
import { ConfidentialClientApplication } from '@azure/msal-node'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_B2C_TENANT_ID}`,
    clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
  },
}

export const tokenRequest = {
  scopes: ['https://graph.microsoft.com/.default'],
}

export const cca = new ConfidentialClientApplication(msalConfig)

const client = jwksClient({
  jwksUri: `${process.env.AZURE_AD_B2C_AUTHORITY}_signin/discovery/v2.0/keys`,
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error('Error getting signing key:', err)
      return callback(err, null)
    }
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  })
}

export async function validateToken(req: HttpRequest) {
  console.log('req', req)
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    throw new Error('Authorization header is required')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decodedToken = new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          audience: process.env.AZURE_AD_B2C_CLIENT_ID,
          issuer: `https://${process.env.AZURE_AD_B2C_TENANT_NAME}/${process.env.AZURE_AD_B2C_TENANT_ID}/v2.0/`,
          algorithms: ['RS256'],
        },
        function (err, decoded) {
          if (err) {
            console.error('Error verifying token:', err)
            return reject(new Error('Invalid token'))
          }
          resolve(decoded)
        }
      )
    })
    return decodedToken
  } catch (err) {
    console.error('Error verifying token:', err)
    throw new Error('Invalid token')
  }
}
