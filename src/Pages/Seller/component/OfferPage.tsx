import { Box, Flex } from '@chakra-ui/react'
import Text from '../../../Components/Text'

import SellerLayout from '../../../Components/SellerLayout'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import CheckMarkAnimation from '../../../../public/lottie/CheckMarkAnimation.json'
import Lottie from 'lottie-react'

export default function OfferPage() {
  const offerData = useAppSelector((state) => state.seller.offer)
  const dispatch = useAppDispatch()
  const sellerData = useAppSelector((state) => state.seller)
  const onNextClick = () => {
    dispatch(setActiveTab(sellerData.activeTab + 1))
  }
  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 1))
  }
  return (
    <SellerLayout
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      showYear={true}
      nextButtonText='accept_offer'
      showDeclineButton
      onDeclineClick={() => {
        dispatch(setActiveTab(sellerData.activeTab + 1))
      }}
    >
      <Box
        h={400}
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        {/* <Flex gap={3}>
          <BsFillStarFill color='#1A41A0' />
          <Box mt={-2}>
            <BsFillStarFill
              size={30}
              color='#1A41A0'
            />
          </Box>
          <BsFillStarFill color='#1A41A0' />
        </Flex> */}
        <Box my={5}>
          <Lottie
            animationData={CheckMarkAnimation}
            style={{ width: '100%', height: '100%' }}
            loop={false}
          />
        </Box>
        <Text
          type='good_news'
          size='17'
          weight='bold'
        />
        <Text
          size='65'
          weight='bold'
        >
          {`£${offerData?.price}!`}
        </Text>
        <Text
          type='look_for_message'
          size='15'
        />
        <Flex
          mt={6}
          gap={6}
        >
          <Text
            type='offer_expire'
            size='13'
          />
          <Text
            size='13'
            ml={-4}
            weight='bold'
          >
            {offerData?.deliverydays}
          </Text>
          <Text
            type='hours'
            size='13'
            ml={-5}
            weight='bold'
          />
        </Flex>
      </Box>
    </SellerLayout>
  )
}
