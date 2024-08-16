import { Box } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import SellerLayout from '../../../Components/SellerLayout'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import BiddingTimerAnimation from '../../../Components/AnimatedComponents/BiddingTimerAnimation'
import CountDownTimer from '../../../Components/CountDownTimer'
import { useEffect, useState } from 'react'
import NoBidAnimation from '../../../Components/AnimatedComponents/NoBidAnimation'
import { sellerApi } from '../../../store/features/seller/sellerApi'
import { calculateSecondsRemaining } from '../../../helper/CommonFunction'

export default function StartBiddingPage() {
  const dispatch = useAppDispatch()
  const userData = useAppSelector((state) => state.user)
  // const offerData = useAppSelector((state) => state.seller.offer)
  const sellerData = useAppSelector((state) => state.seller)
  const currentListing = useAppSelector((state) => state.seller.currentListing.listing)
  const [showNoBid, setshowNoBid] = useState(false)
  const [timeLimitExceed, settimeLimitExceed] = useState(false)
  const [timeLimit, setTimeLimit] = useState<number | null>(null)
  const isBiddingEnabled = currentListing?.bidding_enabled || false
  const status = currentListing?.status || null

  useEffect(() => {
    if (status === 'no_offers_available') {
      setTimeLimit(null)
      setshowNoBid(true)
    }
  }, [status])

  useEffect(() => {
    if (isBiddingEnabled && currentListing?.bidding_closing_time) {
      const secondsLeft = calculateSecondsRemaining(currentListing?.bidding_closing_time)
      setTimeLimit(secondsLeft)
    }
  }, [isBiddingEnabled])

  const onNextClick = () => {
    dispatch(setActiveTab(sellerData.activeTab + 1))
  }
  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 1))
  }

  const handleOnTimeLimitExceed = async () => {
    try {
      const higgestBidResponse = await sellerApi.getHighestBid(
        currentListing?.id?.toString(),
        getHeaders(),
      )
     
      settimeLimitExceed(true)
      setTimeLimit(null)
      dispatch(setActiveTab(5))
    } catch (error: any) {
      settimeLimitExceed(true)
      setshowNoBid(true)
    }
  }

  // TIMER VIEW COMPONENT
  const TimerView = () => {
    return (
      <>
        {/* TIMER ANIMATION */}
        <Box
          h={180}
          display={'flex'}
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <BiddingTimerAnimation />
        </Box>

        {/* TIMER AND BIDING HAS STARTED */}
        {timeLimit ? (
          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <CountDownTimer
              initialTime={timeLimit}
              onEnd={handleOnTimeLimitExceed}
            />
            <Text
              type='biding_has_started'
              size='25'
              
              weight='bold'
              color={'brand.900'}
            />
          </Box>
        ) : (
          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Text
              type='biding_is_in_waiting'
              size='25'
              weight='bold'
              color={'brand.900'}
            />
          </Box>
        )}

        {/* DESCIPTION OF THE CAR */}
        <Box
          h={150}
          display={'flex'}
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Text
            type='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget risus vitae sem ultrices sagittis. Sed vitae nisi quis nisl ultricies aliquam. Sed eget risus vitae sem ultrices sagittis. Sed vitae nisi quis nisl ultricies aliquam.'
            size='15'
            textAlign={'center'}
            color={'gray'}
          />
        </Box>
      </>
    )
  }

  // NO BIDS COMPONENT
  const NoBidView = () => {
    return (
      <>
        {/* TIMER ANIMATION */}
        <Box
          h={170}
          display={'flex'}
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <NoBidAnimation />
        </Box>

        <Box
          display={'flex'}
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={5}
        >
          <Text
            type='no_bidder_found'
            size='25'
            weight='bold'
            color={'brand.900'}
            textTransform={'uppercase'}
          />
        </Box>

        {/* DESCIPTION OF THE CAR */}
        <Box
          h={150}
          display={'flex'}
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Text
            type='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget risus vitae sem ultrices sagittis. Sed vitae nisi quis nisl ultricies aliquam. Sed eget risus vitae sem ultrices sagittis. Sed vitae nisi quis nisl ultricies aliquam.'
            size='15'
            textAlign={'center'}
            color={'gray'}
          />
        </Box>
      </>
    )
  }

  const getHeaders = () => {
    if (userData?.meData) {
      return {
        Authorization: `${userData?.userLoginInfo?.token || ''} `,
      }
    }
    return {
      'seller-token': sellerData.sellerDetail.seller_token ?? '',
    }
  }

  return (
    <SellerLayout
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      showYear={true}
      isNextDisabled={!timeLimitExceed || showNoBid}
      // nextButtonText='loading'
      declineButtonText='no_bids'
      // showDeclineButton
      onDeclineClick={() => {
        // dispatch(setActiveTab(sellerData.activeTab + 1))
        setshowNoBid((prev) => !prev)
      }}
    >
      {showNoBid ? <NoBidView /> : <TimerView />}
    </SellerLayout>
  )
}
