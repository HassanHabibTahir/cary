import { Box } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import { useState, useMemo } from 'react'
import SellerLayout from '../../../Components/SellerLayout'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import { sendVehicleDetailAndGetOffer } from '../../../store/features/seller/sellerAction'


export default function NoticeTimer() {
  const initialSeconds = 5 // 15 seconds
  const dispatch = useAppDispatch()
  const sellerData = useAppSelector((state:any) => state.seller)
  const [isNextDisabled, setisNextDisabled] = useState(true)
  const [loader, setloader] = useState(false)
  const timer = useMemo(() => {
    const currentTimestamp = new Date().getTime() // Get current time in milliseconds since the epoch
    const additionalNs = initialSeconds * 1000 // Convert seconds to nanoseconds
    const resultTimestamp = currentTimestamp + additionalNs
    return resultTimestamp
  }, [initialSeconds])
  const onNextClick = () => {
    dispatch(sendVehicleDetailAndGetOffer(null))
      .unwrap()
      .then(() => {
        setloader(false)
        dispatch(setActiveTab(sellerData.activeTab + 1))
      })
      .catch(() => {
        setloader(false)
      })
  }
  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 1))
  }
  return (
    <SellerLayout
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      showYear={true}
      showBackButton
      isNextDisabled={isNextDisabled}
      isNextLoading={loader}
    >
      <Text
        type='notice'
        size='17'
        weight='bold'
      />
      <Text
        type='notice_desc'
        size='17'
        mt={5}
      />
      <Box
        height={'300px'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={3}
      >
        <Box my={2}>
          <FlipClockCountdown
            labelStyle={{
              color: 'black',
              fontWeight:600
            }}
            digitBlockStyle={{color:'#000', backgroundColor:'#0054DA'}}
            to={timer}
            onComplete={() => {
              setisNextDisabled(false)
              onNextClick()
            }}
            renderMap={[false, false, true, true]}

          >
            <Text
              align={'center'}
              size={'50'}
              weight='bold'
            >
              Time up
            </Text>
          </FlipClockCountdown>
        </Box>
      </Box>
    </SellerLayout>
  )
}
