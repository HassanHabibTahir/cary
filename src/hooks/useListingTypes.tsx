import { useState, useEffect } from 'react'
import { userApi } from '../store/features/user/userApi'

export type SingleListingType = {
  id: number
  name: string
  created_at: string
  updated_at: string
}

const useListingTypes = () => {
  const [lisitingTypes, setLisitingTypes] = useState<SingleListingType[]>([])
  const [loadingListingTypes, setLoadingListingTypes] = useState<boolean>(true)

  useEffect(() => {
    const fetchListingTypes = async () => {
      const data = await userApi.getListingTypes('')
      if (data) {
        setLisitingTypes(data)
        setLoadingListingTypes(false)
      } else {
        setLoadingListingTypes(false)
      }
    }
    fetchListingTypes()
  }, [])

  return { lisitingTypes, loadingListingTypes }
}

export default useListingTypes
