import { Box, Flex } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import SellerLayout from '../../../Components/SellerLayout'

export default function WhyChoose() {
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
      submitBtnId='why-choose-next'
      backBtnId='why-choose-back-btn'
      showBackButton
    >
      <Text
        data-testId='why-choose'
        type='why_choose_heading'
        size='17'
        textAlign={'center'}
        weight='bold'
      />
      <Flex
        mt={5}
        gap={1.5}
      >
        <Text
          type='buyers_length'
          size='17'
        />
        <Text size='17'>{sellerData?.currentListing?.registered_buyers_count}</Text>
        <Text
          type='buyers'
          size='17'
        />
      </Flex>
      <Box mt={5}>
        <Text
          type='why_choose_description'
          size='17'
        />
      </Box>
      <Box mt={5}>
        <Text
          type='30_Mint'
          size='17'
        />
      </Box>
    </SellerLayout>
  )
}
