import { Flex } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import SellerLayout from '../../../Components/SellerLayout'
import CustomInput from '../../../Components/CustomInput'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { signupApiHandler } from '../../../store/features/user/userAction'
import { unwrapResult } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

export default function SignUpToSave() {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const sellerData = useAppSelector((state) => state.seller)
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [loading, setloading] = useState(false)
  const onNextClick = () => {
    setloading(true)
    try {
      dispatch(
        signupApiHandler({
          email: email,
          password: password,
          isBuyer: false,
          buyerZipCode: '',
        }),
      )
        .then(unwrapResult)
        .then(() => {
          setloading(false)

          dispatch(setActiveTab(sellerData.activeTab + 1))
        })
    } catch (error: any) {
      console.log('error=>', error)
      setloading(false)

      toast.error(error)
    } finally {
      setloading(false)
    }
    // dispatch(setActiveTab(sellerData.activeTab + 1))
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
      showSkipButton
      onSkipClick={onNextClick}
      isNextLoading={loading}
      isNextDisabled={!email || !password}
    >
      <Flex
        flexDir={'column'}
        alignItems={'center'}
      >
        <Text
          type='sign_up_save_history'
          size='17'
          mt={5}
          weight='bold'
        />
        <CustomInput
          labelType=''
          value={email}
          onChange={(e: string) => setemail(e)}
          placeholder={t('email')}
          height={'52px'}
          width={{ base: '100%', lg: '90%' }}
          type={'text'}
          pl='20px'
          fontSize={'18px'}
          mt={6}
        />
        <CustomInput
          labelType=''
          value={password}
          onChange={(e: string) => setpassword(e)}
          placeholder={t('password')}
          height={'52px'}
          width={{ base: '100%', lg: '90%' }}
          type={'text'}
          pl='20px'
          fontSize={'18px'}
          mt={6}
        />
      </Flex>
    </SellerLayout>
  )
}
