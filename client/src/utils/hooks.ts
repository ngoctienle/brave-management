import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
  const [params] = useSearchParams()
  const paramsObj = Object.fromEntries([...params])

  return paramsObj
}
