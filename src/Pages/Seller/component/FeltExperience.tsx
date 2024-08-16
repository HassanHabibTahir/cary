import { Box, Textarea } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import SellerLayout from '../../../Components/SellerLayout'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sellerApi } from '../../../store/features/seller/sellerApi'
import { toast } from 'react-toastify'

export default function FeltExperience() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const sellerData = useAppSelector((state) => state.seller)

  const [experience, setExperience] = useState('')
  const [loading, setloading] = useState(false)
  const onNextClick = async () => {
    try {
      if (experience === '') {
        toast.warn('Coneent required')
      }
      setloading(true)
      const listingId = sellerData?.currentListing?.listing?.id
      await sellerApi.feedBack({
        body: experience,
        listing_id: listingId ? listingId : null,
      })
      setloading(false)
      toast.success('Record Saved')
      navigate('/')
      dispatch(setActiveTab(0))
    } catch (error: any) {
      console.log('error', error?.response)
      toast.error(error?.response?.data?.error[0] || 'Something went wrong')
    }
  }
  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 1))
  }
  return (
    <SellerLayout
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      showBackButton
      isNextLoading={loading}
    >
      <Text
        type='felt_experience'
        size='17'
        mt={5}
        weight='bold'
      />
      <Box mt={6}>
        <Textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder={t('enter_experience')}
          width={{ base: '100%' }}
          minH={200}
        />
      </Box>
    </SellerLayout>
  )
}
