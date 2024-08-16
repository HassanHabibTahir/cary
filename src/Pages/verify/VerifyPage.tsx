import {
  Box,
  Stack,
  Heading,
  Input,
  Button,
} from '@chakra-ui/react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Text from '../../Components/Text'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { unWrapApiError } from '../../helper/CommonFunction'
import { useAppDispatch } from '../../store/hooks'
import { getMyData, verifySignUpCodeApiHandler } from '../../store/features/user/userAction'
import { unwrapResult } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { userApi } from '../../store/features/user/userApi'
import EmailVerificationAnimation from '../../Components/AnimatedComponents/EmailVerificationAnimation'
import MainLayout from '../../Components/Layouts/MainLayout'
import InnerLayout from '../signup/InnerLayout'

export default function VerifyPage() {
  const { t } = useTranslation()

  const { user_id, email, password, user_type } = useParams()
  const [searchParams] = useSearchParams();
  const isBuyer = user_type?.toString() === 'null' || user_type?.toLowerCase() === 'buyer'
  const token = searchParams.get('token') || null

  useEffect(() => {
    if (!user_id || !email || !password || !user_type || !token) {
      navigate('/signup')
    }
  }, [user_id, email, password, user_type, token])


  const [emailResendLoading, setEmailResendLoading] = useState(false)
  const [otpState, setOtpState] = useState({
    code: '',
    userId: Number(user_id || 0),
    token: token || '',
    isVisible: true,
  })
  const navigate = useNavigate()

  const [loading, setloading] = useState(false)

  const dispatch = useAppDispatch()

  const resendCodeHandler = async () => {
    setEmailResendLoading(true)
    const response = await userApi.resendEmailVerificationCode(otpState?.userId, otpState?.token)
    if (response) {
      toast.success(t('code_send_successfully'))
      setEmailResendLoading(false)
    } else {
      toast.error(t('something_went_wrong_while_sending_code'))
      setEmailResendLoading(false)
    }
  }

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault()
    if (otpState?.code?.trim() === '') {
      toast.error(t('please_enter_code'))
      return
    }

    try {
      setloading(true)
      const payload = {
        userId: otpState?.userId || 0,
        code: otpState?.code || '',
        token: otpState?.token || '',
        email: email || '',
        password: password || '',
        isBuyer: isBuyer || false,
      }

      dispatch(verifySignUpCodeApiHandler(payload as any))
        .then(unwrapResult)
        .then((response: any) => {
          const token = response?.token || ''
          dispatch(getMyData({ token: token })).then(() => {
            if (isBuyer) {
              setloading(false)
              navigate('/profile')
            } else {
              userApi
                .createUserBasedOnType({
                  token: token,
                  isBuyer: false,
                })
                .then(() => {
                  setloading(false)
                  navigate('/seller')
                })
                .catch(() => {
                  setloading(false)
                  toast.error(t('something_went_wrong_while_creating_seller'))
                })
            }
          })
        })
        .catch(() => {
          setloading(false)
        })
    } catch (error) {
      setloading(false)
      unWrapApiError(error)
    }
  }

  return (
    <>
      <MainLayout>
        <InnerLayout>
          <Stack
            bg={'gray.50'}
            rounded={'xl'}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: 'lg' }}
          >
            <>
              <Box h={'150px'} display={'inline'}>
                <EmailVerificationAnimation />
              </Box>
              <Stack
                bg={'gray.50'}
                rounded={'xl'}
                spacing={{ base: 8 }}
                maxW={{ lg: 'lg' }}
              >
                <Box>
                  <Heading
                    lineHeight={1.1}
                    fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                    display={'flex'}
                  >
                    <Text
                      size='27'
                      weight='bolder'
                      type={'account_not_confirmed'}
                      color={'brand.900'}
                      textAlign={'center'}
                    />
                  </Heading>
                  {otpState.isVisible ?
                    <Text
                      mt={5}
                      textAlign={'center'}
                      color={'gray.500'}
                      fontSize={{ base: 'md', sm: 'md' }}
                      type={'sign_up_buyer_verification_desc'}
                    />
                    :
                    <Text
                      mt={5}
                      textAlign={'center'}
                      color={'gray.500'}
                      fontSize={{ base: 'md', sm: 'md' }}
                      type={isBuyer ? 'sign_up_buyer_desc' : 'sign_up_seller_desc'}
                    />
                  }
                </Box>
                (
                <Box data-testId='signup-heading'>
                  <Stack spacing={4}>
                    <Input
                      placeholder={t('verification_code')}
                      bg={'gray.100'}
                      data-testId='otp-input'
                      border={0}
                      max={6}
                      min={6}
                      color={'gray.500'}
                      _placeholder={{
                        color: 'gray.500',
                      }}
                      value={otpState?.code}
                      onChange={(e) => setOtpState({ ...otpState, code: e.target.value })}
                    />
                  </Stack>
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
                    />
                    <Text
                      as='span'
                      ml={2}
                      fontWeight={'bold'}
                      color={emailResendLoading ? 'gray.500' : 'brand.900'}
                      fontSize={'18px'}
                      cursor={'pointer'}
                      type='resend_code'
                      textDecoration={'underline'}
                      onClick={() => {
                        if (!emailResendLoading) {
                          resendCodeHandler()
                        }
                      }}
                    />
                  </Text>
                  <Button
                    fontFamily={'heading'}
                    mt={8}
                    data-testId='signup-button'
                    w={'full'}
                    bg={emailResendLoading ? 'gray.500' : 'brand.900'}
                    disabled={emailResendLoading}
                    color={'white'}
                    _hover={{
                      bg: 'brand.900',
                      boxShadow: 'xl',
                    }}
                    onClick={handleVerifyOtp}
                    isLoading={loading}
                  >
                    <Text type={'Verify'} />
                  </Button>
                </Box>
                )
              </Stack>
            </>
          </Stack >
        </InnerLayout>
      </MainLayout>
    </>
  )
}
