import { Button, Checkbox, Flex, HStack, PinInput, PinInputField } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import CustomInput from '../../../Components/CustomInput'
import SellerLayout from '../../../Components/SellerLayout'
import Text from '../../../Components/Text'
import { sellerApi } from '../../../store/features/seller/sellerApi'
import { setActiveTab, updatedSellerData } from '../../../store/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { patchSeller } from '../../../store/features/seller/sellerAction'
import { unwrapResult } from '@reduxjs/toolkit'

export default function PhoneVerification() {
  const dispatch = useAppDispatch()
  const currentListing = useAppSelector((state) => state.seller.currentListing.listing)
  const sellerData = useAppSelector((state) => state.seller)
  const userData = useAppSelector((state) => state.user)
  const { t } = useTranslation()
  const [isCodeSent, setisCodeSent] = useState(false)
  const [codeSendLoading, setcodeSendLoading] = useState(false)
  const [codeVerifyLoading, setcodeVerifyLoading] = useState(false)
  const [otp, setotp] = useState('')
  const [timer, setTimer] = useState(0)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [isValidCode, setisValidCode] = useState<boolean>(false)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    } else {
      setTimer(0)
    }
  }, [timer])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (key: any, value: string) => {
    dispatch(
      updatedSellerData({
        [key]: value,
      }),
    )
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updatedSellerData({
        code_confirmation: event.target.checked,
      }),
    )
  }

  const onNextClick = () => {
    dispatch(setActiveTab(sellerData.activeTab + 1))
  }

  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 1))
  }

  const getSellerInfo = () => {
    if (userData?.meData) {
      return userData?.meData?.seller?.seller_info ?? {}
    }
    return sellerData.sellerDetail ?? {}
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

  const sendCodeHandler = async () => {
    if (!sellerData.seller.enter_mobile_phones) {
      toast.error(`${t('enter_mobile_phones')} is required`)
      return
    }
    setcodeSendLoading(true)
    const phone_number = `+${sellerData.seller.enter_mobile_phones}`
    const mobile_phoneable_type = 'Seller'
    const mobile_phoneable_id = getSellerInfo()?.id ?? ''
    const headers = getHeaders() ?? {}

    const response = await sellerApi.sendPhoneVerificationCode(
      phone_number,
      mobile_phoneable_id,
      mobile_phoneable_type,
      headers,
    )
    if (response && response?.id) {
      const verificationId = response?.id || ''
      setVerificationId(verificationId)
      toast.success(t('code_send_successfully'))
    }

    setcodeSendLoading(false)
    dispatch(
      patchSeller({
        mobile_phone_number: phone_number,
        id: mobile_phoneable_id,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        setisCodeSent(true)
        setTimer(30)
        setcodeSendLoading(false)
      })
      .catch((err) => {
        toast.error(err)
        setcodeSendLoading(false)
      })
  }

  const verifyHandler = async () => {
    try {
      setcodeVerifyLoading(true)
      // const result = await sellerApi.verifyCode(otp)
      const phone_number = `+${sellerData.seller.enter_mobile_phones}`
      const headers = getHeaders()

      const result = await sellerApi.verifyPhoneVerificationCode(
        verificationId || '',
        phone_number,
        otp,
        headers,
      )

      setcodeVerifyLoading(false)

      if (!result) {
        toast.error('Invalid code')
        return
      }
      toast.success('Code verified successfully')
      setisValidCode(true)
      // const nestScreen =
      //   userData?.isLogin && userData?.userLoginInfo?.user_type === 'Seller' ? 2 : 1
      if (currentListing?.id) {
        await startBidding(currentListing?.id?.toString())
      }
      dispatch(setActiveTab(sellerData.activeTab + 1))
      setcodeVerifyLoading(false)
    } catch (error: any) {
      toast.error('Invalid code')
      setcodeVerifyLoading(false)
    }
  }

  const startBidding = async (bidId: string) => {
    try {
      const headers = getHeaders()
      await sellerApi.enableBidding(bidId, headers)
    } catch (error) {
      console.log(error)
    }
  }

  function getDisabledStatus() {
    return (
      !sellerData?.seller.code_confirmation || !sellerData?.seller.enter_mobile_phones || timer > 0
    )
  }

  return (
    <SellerLayout
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      showYear={true}
      showBackButton={!isCodeSent}
      showNextButton={true}
      isNextDisabled={!isValidCode}
    >
      {!isCodeSent && (
        <>
          <Text
            type='number_info'
            size='17'
            textAlign={'left'}
            mb={4}
          />
          <Flex
            justifyContent={'center'}
            gap={1.5}
            mb={4}
          >
            <Text
              type='start_info_and_company_number'
              size='17'
            />
            <Text
              type='company'
              size='17'
              weight='bold'
            />
            <Text
              type='mid_info_and_company_number'
              size='17'
            />
            <Text
              type='company_number'
              size='17'
              weight='bold'
            />
          </Flex>

          <Flex justifyContent={'center'}>
            <CustomInput
              labelType=''
              value={sellerData.seller.enter_mobile_phones ?? ''}
              onChange={(e: string) => handleInputChange('enter_mobile_phones', e)}
              placeholder={t('enter_mobile_phones')}
              width={{ base: '100%', lg: '100%' }}
              height='52px'
              pl='20px'
              fontSize='18px'
              type={'number'}
            />
          </Flex>

          <Flex
            mt={5}
            alignItems={'center'}
            gap={2}
          >
            <Checkbox
              checked={sellerData?.seller.code_confirmation}
              onChange={handleCheckboxChange}
            />
            <Text
              type='code_confirmation'
              size='17'
              textAlign={'left'}
            />
          </Flex>

          <Flex
            alignItems={'center'}
            gap={3}
          >
            <Button
              width={130}
              bg={'brand.900'}
              colorScheme='none'
              onClick={sendCodeHandler}
              mt={4}
              isLoading={codeSendLoading}
              isDisabled={getDisabledStatus()}
            >
              <Text
                type={'send_code'}
                size='17'
                color='white'
              />
            </Button>
            {timer > 0 && <Text mt={4}>{`${timer} second remaining`}</Text>}
          </Flex>
        </>
      )}

      {isCodeSent && (
        <Flex
          flexDir={'column'}
          alignItems={'center'}
          mt={5}
        >
          <Text
            weight='700'
            fontSize={'32px'}
            type={'otp_verification'}
          />
          <Text
            mt={'8px'}
            fontSize={'18px'}
            textAlign={'center'}
            lineHeight={'30px'}
            color={'#687380'}
          >
            <Text
              as={'span'}
              type={'enter_otp'}
            />{' '}
            <Text
              as='span'
              fontWeight={'bold'}
              color={'#1E344E'}
            >
              {sellerData.seller.enter_mobile_phones}
            </Text>{' '}
            <Text
              as='span'
              type={'code_valid_for'}
            />{' '}
            <Text
              onClick={() => setisCodeSent(false)}
              cursor={'pointer'}
              as='span'
              fontWeight={'bold'}
              // bg={'brand.900'}
              type={'change_number'}
            />
          </Text>
          <Text
            fontWeight={'500'}
            mt={'25px'}
            fontSize={'20px'}
            color={'#1E344E'}
            type={'enter_varification_code'}
          />
          <HStack mt={'20px'}>
            <PinInput onChange={(e: string) => setotp(e)}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <PinInputField
                    key={index}
                    width={'80px'}
                    height={'90px'}
                    rounded={'16px'}
                    fontSize={'20px'}
                    fontWeight={500}
                  />
                ))}
            </PinInput>
          </HStack>
          <Button
            width={'360px'}
            height={'62px'}
            bg={'brand.900'}
            colorScheme='none'
            onClick={verifyHandler}
            isDisabled={otp?.length !== 6}
            mt={'40px'}
            isLoading={codeVerifyLoading}
          >
            <Text
              type={'Submit'}
              size='22'
              color='white'
            />
          </Button>
          <Text
            mt={'12px'}
            fontSize={'15px'}
            textAlign={'center'}
            lineHeight={'30px'}
            color={'#687380'}
          >
            <Text
              as={'span'}
              type={'not_recieved_code'}
            />{' '}
            <Text
              as='span'
              ml={2}
              fontWeight={'bold'}
              // bg={'brand.900'}
              fontSize={'15px'}
              cursor={'pointer'}
              type='resend_code'
              onClick={sendCodeHandler}
            />
          </Text>
        </Flex>
      )}
    </SellerLayout>
  )
}
