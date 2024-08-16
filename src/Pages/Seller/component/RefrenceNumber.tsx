import { Box, Image, useBreakpointValue } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import SellerLayout from '../../../Components/SellerLayout'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
export default function RefrenceNumber() {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const offerData = useAppSelector((state) => state.seller.acceptOfffer)
  const dispatch = useAppDispatch()
  const sellerData = useAppSelector((state) => state.seller)
  const requestCall = () => {
    dispatch(setActiveTab(sellerData?.activeTab + 1))

  }
  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 1))
  }
  return (
    <SellerLayout
      onNextClick={requestCall}
      onBackClick={onBackClick}
      showYear={true}
      showBackButton
      nextButtonText='request_call'
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
          <Image src="/Successmark.png"/>
        </Box>
        <Text
          type='your_ref_num'
          size='17'
          weight='bold'

        />
        <Text
          size={isMobile ? '40' : '65'}
          weight='bold'
        >
          {offerData?.refrenceNumber}
        </Text>
        <Text
          weight='bold'
          size='30'
          mb={3}
        >
          Buyer: Mike
        </Text>
        <Text
          type='ref_num_desc'
          size='15'
          width={{ base: '100%', md: 400 }}
          textAlign={'center'}
        />
        <Text
          type='ref_contact'
          size='13'
          mt={5}
        />
      </Box>
    </SellerLayout>
  )
}
