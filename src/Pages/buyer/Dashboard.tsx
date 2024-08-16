import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Sidebar from './component/Sidebar'
import { useAppSelector } from '../../store/hooks'
import { useEffect, useState } from 'react'
import { userApi } from '../../store/features/user/userApi'
import FeedbackSubmittedAnimation from '../../Components/AnimatedComponents/FeedbackSubmittedAnimation'
import MainLayout from '../../Components/Layouts/MainLayout'

const Dashboard = () => {
  const userData = useAppSelector((state) => state.user)
  const buyer = userData?.meData?.buyer || null
  const [loading, setLoading] = useState(false)
  const [isActiveRegion, setIsActiveRegion] = useState(false)

  useEffect(() => {
    setLoading(true)
    checkIfRegionActive()
  }, [buyer])

  const checkIfRegionActive = async () => {
    try {
      if (!buyer || !buyer?.buyer_info) {
        setIsActiveRegion(false)
        setLoading(false)
        return false
      }
      const response = await userApi.getBuyerById(
        buyer?.buyer_info?.id,
        userData?.userLoginInfo?.token,
      )
      if (response?.buyer) {
        setLoading(false)
        setIsActiveRegion(response?.buyer?.region_active)
        return response?.buyer?.region_active || false
      }
      setLoading(false)
      setIsActiveRegion(false)
      return true
    } catch (error) {
      setLoading(false)
      setIsActiveRegion(false)
      return false
    }
  }

  const isRegionActive = !loading && isActiveRegion

  return (
    <MainLayout hideLinks={true}>
      <Flex
        m={'0'}
        p={'0'}
        height={'100%'}
      >
        {isRegionActive && <Sidebar />}
        <Box
          bgColor='#F6F7F9'
          // height={'86vh'}
          height={'100%'}
          overflowY={'auto'}
          p={'6'}
          flex='1'
        >
          {isRegionActive ? <Outlet /> : <FeedbackSubmittedAnimation />}
        </Box>
      </Flex>
    </MainLayout>
  )
}
export default Dashboard
