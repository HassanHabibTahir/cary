import {
  Button,
  Flex,
  HStack,
  NumberInput,
  NumberInputField,
  PinInput,
  PinInputField,
  useMediaQuery,
} from '@chakra-ui/react'
import Text from '../../../../Components/Text'
import ProfileLayoutContainerLayout from './ProfileLayoutContainerLayout'
import { InterestProfileStepProps } from './InterestProfileStepsWrapper'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../store/hooks'
import { sellerApi } from '../../../../store/features/seller/sellerApi'
import { getInterestProfile } from '../../../../helper/CommonFunction'

export default function PhoneNumberStep({
  activeTab,
  interestProfile,
  handleInputChange,
  handleNextClick,
  handleBackClick,
}: InterestProfileStepProps) {
  const { t } = useTranslation()
  const [isMobile] = useMediaQuery('(max-width: 480px)') // Adjust the breakpoint as needed
  const userData = useAppSelector((state) => state.user)
  const token = userData?.userLoginInfo?.token
  const apiInterestProfile = getInterestProfile(userData?.meData)
  const [isCodeSent, setisCodeSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)

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

  useEffect(() => {
    if (otp && otp.length === 6) {
      verifyHandler()
    }
  }, [otp])

  const getHeaders = () => {
    if (userData?.meData) {
      return {
        Authorization: `${token || ''} `,
      }
    }
    return {
      'buyer-token': '',
    }
  }

  const verifyHandler = async () => {
    if (!otp || otp.length < 6) {
      toast.error(`${t('enter_otp')}`)
      return
    }
    try {
      setLoading(true)
      const phone_number = `+${interestProfile?.mobile_phone_number}`
      const headers = getHeaders()

      const result = await sellerApi.verifyPhoneVerificationCode(
        verificationId || '',
        phone_number,
        otp,
        headers,
      )

      if (!result) {
        toast.error('Invalid code')
        setLoading(false)
        return
      } else {
        toast.success('Code verified successfully')
        setLoading(true)
        handleNextClick()
        return
      }
    } catch (error: any) {
      setLoading(false)
      toast.error('Invalid code')
    }
  }

  const getFormatedPhoneNumber = (phone: string) => {
    if (phone.startsWith('+1')) {
      return phone
    }
    return `+1${phone}`
  }

  const sendCodeHandler = async () => {
    if (!interestProfile?.mobile_phone_number) {
      toast.error(`${t('enter_mobile_phones')}`)
      return
    }
    try {
      setLoading(true)
      setOtp('')
      const phone_number = getFormatedPhoneNumber(interestProfile?.mobile_phone_number)
      const mobile_phoneable_type = 'InterestProfile'
      const mobile_phoneable_id = apiInterestProfile?.id || 0
      const headers = getHeaders() ?? {}

      const response = await sellerApi.sendPhoneVerificationCode(
        phone_number,
        mobile_phoneable_id,
        mobile_phoneable_type,
        headers,
      )

      if (response && response?.id) {
        setVerificationId(response?.id || '')
        setisCodeSent(true)
        toast.success(t('code_send_successfully'))
        setLoading(false)
      } else {
        setLoading(false)
        setisCodeSent(false)
        toast.error('Please check you number and try again')
      }
    } catch (error) {
      setLoading(false)
      setisCodeSent(false)
      toast.error('Please check you number and try again')
    }
  }

  const parse = (val: string) => val.replace(/^\+1/g, '')

  return (
    <>
      <ProfileLayoutContainerLayout
        showBackButton
        showNextButton
        isNextDisabled={true}
        activeTab={activeTab}
        onNextClick={handleNextClick}
        onBackClick={() => {
          if (handleBackClick) {
            handleBackClick()
          }
        }}
        topHeading={
          <Text
            type={`phone_number_step_desc`}
            size='20'
            textAlign={'center'}
            color={'gray'}
          />
        }
      >
        {!isCodeSent && (
          <>
            <Flex
              justifyContent={'center'}
              mt={4}
            >
              <Flex
                flexDirection={'column'}
                gap='0.8rem'
                w={'100%'}
              >
                <Text
                  color={'brand.900'}
                  fontSize={'1.12rem'}
                  fontWeight={'700'}
                  type='phone_number'
                />
                <NumberInput
                  width={{ base: '100%', lg: '100%' }}
                  height='52px'
                  fontSize='18px'
                  sx={{ borderRadius: '0px' }}
                  placeholder={t('enter_phone_number')}
                  onChange={(valueString) => {
                    if (valueString !== '+' && valueString.startsWith('+1')) {
                      handleInputChange('mobile_phone_number', parse(valueString))
                    }
                  }}
                  format={() => {
                    if (!interestProfile?.mobile_phone_number?.includes('+1')) {
                      return '+1' + interestProfile?.mobile_phone_number
                    } else if (interestProfile?.mobile_phone_number === '+1') {
                      return '+1'
                    }
                    return interestProfile?.mobile_phone_number
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </Flex>
            </Flex>
            <Text
              type={`phone_number_step_sub_desc`}
              size='14'
              color={'gray'}
              pt={'1rem'}
            />
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
                isLoading={loading}
                isDisabled={loading}
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
            mt={2}
          >
            <Text
              mt={'0px'}
              fontSize={'18px'}
              textAlign={'center'}
              lineHeight={'30px'}
              color={'#687380'}
            ></Text>
            <Text
              fontWeight={'500'}
              mt={'25px'}
              fontSize={'20px'}
              color={'#1E344E'}
              type={'otp_verification_desc'}
              mb={'20px'}
              textAlign={'center'}
            />
            <HStack mt={'20px'}>
              <PinInput onChange={(e: string) => setOtp(e)}>
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <PinInputField
                      key={index}
                      width={isMobile ? '47px' : '80px'}
                      height={isMobile ? '47px' : '80px'}
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
              isLoading={loading}
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
                as='span'
                fontWeight={'bold'}
                color={'brand.900'}
                fontSize={'15px'}
                cursor={'pointer'}
                type='request_new_code'
                textDecoration={'underline'}
                onClick={sendCodeHandler}
              />
            </Text>
          </Flex>
        )}
      </ProfileLayoutContainerLayout>
    </>
  )
}
