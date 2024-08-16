/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab, updatedSellerData } from '../../../store/features/seller/sellerSlice'
import CustomInput from '../../../Components/CustomInput'
import { useTranslation } from 'react-i18next'
import SellerLayout from '../../../Components/SellerLayout'
import { patchListing, patchSeller } from '../../../store/features/seller/sellerAction'
import { useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'

export default function PickAndDropInfo() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const sellerData = useAppSelector((state) => state.seller)
  const [loader, setloader] = useState(false)
  const handleInputChange = (key: any, value: string) => {
    dispatch(
      updatedSellerData({
        [key]: value,
      }),
    )
  }

  const onNextClick = () => {
    setloader(true)
    dispatch(
      patchListing({
        pickup_address: {
          street1: sellerData.seller.street_line_1 ?? '',
          street2: sellerData.seller.street_line_2 ?? '',
          city: sellerData.seller.city ?? '',
          state: sellerData.seller.state ?? '',
          zip: sellerData.seller.zip_code ?? '',
        },
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        dispatch(
          patchSeller({
            contact_name: sellerData?.seller.contact_name,
            contact_email: sellerData?.seller?.email,
            id: result.seller_id,
          }),
        )
          .then(() => {
            setloader(false)
            dispatch(setActiveTab(sellerData.activeTab + 1))
          })
          .catch((err) => {
            setloader(false)
            console.log('error', err)
          })
      })
      .catch(() => {
        setloader(false)
      })

    // dispatch(acceptOfferHandler())
    //   .unwrap()
    //   .then(() => {
    //     setloader(false)
    //     dispatch(setActiveTab(sellerData.activeTab + 1))
    //   })
    //   .catch(() => {
    //     setloader(false)
    //   })
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
      nextButtonText='accept_offer'
      isNextLoading={loader}
      isNextDisabled={
        sellerData.seller.email === '' ||
        sellerData.seller.contact_name === '' ||
        sellerData.seller.street_line_1 === '' ||
        sellerData.seller.city === '' ||
        sellerData.seller.zip_code === '' ||
        sellerData.seller.state === '' ||
        sellerData.seller.street_line_2 === ''
      }
    >
      {sellerData?.seller.pickUp && (
        <Box>
          <Text
            type='vehicle_location'
            my={5}
          />
          <Flex
            gap={3}
            flexWrap={'wrap'}
          >
            <CustomInput
              labelType=''
              value={sellerData.seller.street_line_1 ?? ''}
              onChange={(e: string) => handleInputChange('street_line_1', e)}
              placeholder={t('street_line_1')}
              width={{ base: '100%', lg: '45%' }}
            />
            <CustomInput
              labelType=''
              value={sellerData.seller.street_line_2 ?? ''}
              onChange={(e: string) => handleInputChange('street_line_2', e)}
              placeholder={t('street_line_2')}
              width={{ base: '100%', lg: '45%' }}
            />
            <CustomInput
              labelType=''
              value={sellerData.seller.city ?? ''}
              onChange={(e: string) => handleInputChange('city', e)}
              placeholder={t('city')}
              width={{ base: '100%', lg: '45%' }}
            />
            <CustomInput
              labelType=''
              value={sellerData.seller.state ?? ''}
              onChange={(e: string) => handleInputChange('state', e)}
              placeholder={t('state')}
              width={{ base: '100%', lg: '45%' }}
            />
            <CustomInput
              labelType=''
              value={sellerData.seller.zip_code ?? ''}
              onChange={(e: string) => handleInputChange('zip_code', e)}
              placeholder={t('zip_code')}
              width={{ base: '100%', lg: '30%' }}
            />
          </Flex>
          <Text
            type='contact_info'
            my={5}
          />
          <CustomInput
            labelType=''
            value={sellerData.seller.contact_name ?? ''}
            onChange={(e: string) => handleInputChange('contact_name', e)}
            placeholder={t('contact_name')}
            width={{ base: '100%', lg: '30%' }}
          />
          <CustomInput
            labelType=''
            value={sellerData.seller.email ?? ''}
            onChange={(e: string) => handleInputChange('email', e)}
            placeholder={t('email')}
            width={{ base: '100%', lg: '30%' }}
            mt={5}
          />
        </Box>
      )}
    </SellerLayout>
  )
}
