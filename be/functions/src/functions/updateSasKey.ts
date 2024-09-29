import { validateToken } from '../utils/aadB2C'
import { errorHandler } from '../utils/fetchUtils'
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  SASProtocol,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob'

const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
const storageAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY

interface RequestBody {
  containerName: string
}

export async function updateSasKey(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`)

  try {
    await validateToken(request)
    if (!storageAccountName || !storageAccountKey) {
      throw new Error('Azure Storage account name and key are required.')
    }

    const req = (await request.json()) as RequestBody

    const containerName = request.query.get('containerName') || req.containerName

    if (!containerName) {
      return {
        status: 400,
        body: 'Please pass a container name on the query string or in the request body',
      }
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(
      storageAccountName,
      storageAccountKey
    )
    const blobServiceClient = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net`,
      sharedKeyCredential
    )

    const containerClient = blobServiceClient.getContainerClient(containerName)
    const exists = await containerClient.exists()
    if (!exists) {
      return {
        status: 400,
        body: 'The specified container does not exist.',
      }
    }

    const startDate = new Date()
    const expiryDate = new Date(startDate)
    expiryDate.setHours(startDate.getHours() + 1)

    const sasPermissions = new BlobSASPermissions()
    sasPermissions.write = true
    sasPermissions.delete = true
    sasPermissions.read = true

    const sasOptions = {
      containerName,
      permissions: sasPermissions,
      protocol: SASProtocol.Https,
      startsOn: startDate,
      expiresOn: expiryDate,
      version: '2020-08-04',
    }

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString()

    return {
      status: 200,
      body: JSON.stringify({
        sasToken,
        url: `https://${storageAccountName}.blob.core.windows.net/${containerName}?${sasToken}`,
      }),
    }
  } catch (e) {
    return errorHandler(e)
  }
}

app.http('updateSasKey', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: updateSasKey,
})
