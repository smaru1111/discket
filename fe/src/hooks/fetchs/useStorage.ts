import { fetchApiWithEnv } from '@/hooks/useFetchApiWithEnv'
import { BlobServiceClient } from '@azure/storage-blob'

export default function useStorage() {
  const fetchSasKey = async (): Promise<string> => {
    const response = await fetchApiWithEnv('/api/UpdateSasKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ containerName: 'documents' }),
    })

    return response.sasToken
  }

  const uploadFile = async (file: File) => {
    if (!file) {
      throw new Error('ファイルを選択してください')
    }
    try {
      const sas = await fetchSasKey()
      const accountName = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME
      const containerName = 'documents'
      const fileName = `${file.name}`
      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sas}`
      )
      const containerClient = blobServiceClient.getContainerClient(containerName)
      const createFilePath = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`
      const blockBlobClient = containerClient.getBlockBlobClient(fileName)
      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
      })
      return createFilePath
    } catch (error) {
      throw new Error(`アップロードに失敗しました: ${error}`)
    }
  }

  const deleteFile = async (fileName: string, sas: string) => {
    try {
      const accountName = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME
      const containerName = 'documents'
      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sas}`
      )
      const containerClient = blobServiceClient.getContainerClient(containerName)
      const blockBlobClient = containerClient.getBlockBlobClient(fileName)
      await blockBlobClient.delete()
    } catch (error) {
      throw new Error(`削除に失敗しました: ${error}`)
    }
  }

  return {
    fetchSasKey,
    uploadFile,
    deleteFile,
  }
}
