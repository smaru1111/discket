export const getQueryParams = (url: string, name: string) => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get(name)
}
export const errorHandler = (error: any) => {
  console.error(error)
  if (error.message === 'Authorization header is required' || error.message === 'Invalid token') {
    return { body: error.message, status: 401 }
  }
  return { body: error.message, status: 500 }
}
