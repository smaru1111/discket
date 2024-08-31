export const getQueryParams = (url: string, name: string) => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get(name)
}