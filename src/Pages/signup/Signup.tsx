import {
  Box,
  Flex,
  Stack,
  Heading,
  Input,
  Button,
  Image,
  Divider,
} from '@chakra-ui/react'
import { Link as NextLink, useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-duplicate-imports
import { Link as ChakraLink } from '@chakra-ui/react'
import Text from '../../Components/Text'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
  checkIfStringContainsSpaces,
  isArray,
  isValidEmail,
  unWrapApiError,
} from '../../helper/CommonFunction'
import { useAppDispatch } from '../../store/hooks'
import { getMyData, verifySignUpCodeApiHandler } from '../../store/features/user/userAction'
import { unwrapResult } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { userApi } from '../../store/features/user/userApi'
import EmailVerificationAnimation from '../../Components/AnimatedComponents/EmailVerificationAnimation'
import SignUpAnimation from '../../Components/AnimatedComponents/SignUpAnimation'
import EligibilityRequirementAnimation from '../../Components/AnimatedComponents/EligibilityRequirementAnimation'
import MainLayout from '../../Components/Layouts/MainLayout'
import InnerLayout from './InnerLayout'

const LineItem = ({
  title,
  isChecked,
  subtitle,
}: {
  title: string
  subtitle: string
  isChecked?: boolean
}) => {
  return (
    <Box mb={6}>
      <Flex
        direction={'row'}
        align={'center'}
      >
        <Image
          src={isChecked ? '/check.png' : '/cross.png'}
          sx={{
            width: '2rem',
            height: '2rem',
            marginRight: '0.5rem',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        />
        <Flex
          direction={'column'}
          ml={3}
        >
          <Text
            color='brand.900'
            fontSize='1.3rem'
            fontWeight='700'
          >
            {title}
          </Text>
          <Text
            color='#90A3BF'
            fontSize='0.9rem'
            fontWeight='500'
            pt='0.3rem'
          >
            {subtitle}
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}

export default function Signup() {
  const { t } = useTranslation()
  const [lineItems, setLineItems] = useState([
    {
      title: 'Registered Copart Buyer',
      subtitle: 'Within the US, and not the general public',
      isFine: true,
    },
    {
      title: 'Licensed',
      subtitle: 'You must be a paid, licensed Copart Buyer',
      isFine: true,
    },
    {
      title: 'Signed up for ePay with Copart',
      subtitle: `Must have "ePay" set up on the Copart site`,
      isFine: true,
    },
  ])
  const [emailResendLoading, setEmailResendLoading] = useState(false)
  const [otpState, setOtpState] = useState({
    code: '',
    userId: '',
    token: '',
    isVisiable: false,
  })

  const [loginData, setloginData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    isBuyer: true,
  })
  const navigate = useNavigate()

  const [loading, setloading] = useState(false)
  const [nonCopartView, setNonCopartView] = useState(false)

  const dispatch = useAppDispatch()

  const submitHandler = async (e: any) => {
    try {
      e.preventDefault()

      if (loginData.email?.trim().length === 0) {
        toast.error(t('please_enter_email'))
        return
      }

      if (!isValidEmail(loginData.email)) {
        toast.error(t('please_enter_valid_email'))
        return
      }

      if (checkIfStringContainsSpaces(loginData.email)) {
        toast.error(t('please_enter_email_without_spaces'))
        return
      }

      if (loginData.password?.trim().length === 0) {
        toast.error(t('please_enter_password'))
        return
      }

      if (loginData.confirmPassword?.trim().length === 0) {
        toast.error(t('please_enter_confirm_password'))
        return
      }

      if (loginData.password !== loginData.confirmPassword) {
        toast.error(t('password_does_not_match'))
        return
      }

      setloading(true)
      const apiPayload = loginData

      const userDetail = await userApi.signUpApi(apiPayload)
      if (userDetail?.token && userDetail?.user_id) {
        setOtpState({
          ...otpState,
          userId: userDetail?.user_id,
          token: userDetail?.token,
          isVisiable: true,
        })
      } else {
        toast.error('Something went wrong while signup!')
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors || ''
      if (isArray(errors)) {
        const tempLineItems = [...lineItems]
        errors.forEach((element: string) => {
          if (element?.toLowerCase()?.includes('copart memberid not present')) {
            tempLineItems[0].isFine = false
          }
          else if (
            element?.toLowerCase()?.includes('copart premiermember false') ||
            element?.toLowerCase()?.includes('copart paidmember false') ||
            element?.toLowerCase()?.includes('copart paidmembership false')
          ) {
            tempLineItems[1].isFine = false
          } else if (element?.toLowerCase()?.includes('copart epay setup not enabled')) {
            tempLineItems[2].isFine = false
          }
        })
        const isAnyNotFine = tempLineItems.some((item) => !item.isFine)
        if (isAnyNotFine) {
          setNonCopartView(true)
        } else {
          setNonCopartView(false)
          const isEmailAlreadyTaken = errors?.some(
            (item: string) => item === 'Email has already been taken',
          )
          if (isEmailAlreadyTaken) {
            toast.error(t('email_already_taken'))
          }
        }
        setLineItems(tempLineItems)
      } else {
        toast.error(errors)
      }
    } finally {
      setloading(false)
    }
  }

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
        userId: otpState?.userId,
        code: otpState?.code,
        token: otpState?.token,
        email: loginData?.email,
        password: loginData?.password,
        isBuyer: loginData?.isBuyer,
      }

      dispatch(verifySignUpCodeApiHandler(payload))
        .then(unwrapResult)
        .then((response: any) => {
          const token = response?.token || ''
          dispatch(getMyData({ token: token })).then(() => {
            if (loginData.isBuyer) {
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

  const NonCopartMemberView = () => {
    return (
      <>
        <Box h={'150px'} display={'inline'}>
          <EligibilityRequirementAnimation />
        </Box>
        <Stack
          bg={'gray.50'}
          rounded={'xl'}
          spacing={{ base: 8 }}
          maxW={{ lg: 'lg' }}
        >
          <Stack spacing={4} >
            <Heading
              lineHeight={1.1}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              display={'flex'}
              gap={1}
              textAlign={'center'}
              justifyContent={'center'}
            >
              <Text
                size='36'
                color={'brand.900'}
                weight='bolder'
                type={'eligibility_requirements'}
                textAlign={'center'}
                justifyContent={'center'}
                align={'center'}
              />
            </Heading>
            <Text
              color={'gray.500'}
              fontSize={{ base: 'sm', sm: 'md' }}
              mt={3}
              type='eligibility_requirements_description'
              textAlign={'center'}
            />
            <Divider sx={{ borderColor: 'gray' }} />
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {lineItems.map((item, index) => {
              return (
                <LineItem
                  key={index}
                  title={item.title}
                  subtitle={item.subtitle}
                  isChecked={item.isFine}
                />
              )
            })}
            <Divider sx={{ borderColor: 'gray' }} />
          </Box>
          <Text
            color={'gray.500'}
            fontSize={{ base: 'sm', sm: 'md' }}
            mt={3}
            type='eligibility_requirements_bottom_note'
            textAlign={'center'}
          />
          <Button
            fontFamily={'heading'}
            mt={2}
            data-testId='signup-button'
            w={'full'}
            bg={'brand.900'}
            color={'white'}
            _hover={{
              bg: 'brand.900',
              boxShadow: 'xl',
            }}
            onClick={() => {
              setNonCopartView(false)
              setLineItems(lineItems.map((i) => ({ ...i, isFine: true })))
            }}
            isLoading={loading}
          >
            <Text type={'Close'} />
          </Button>
        </Stack>
      </>

    )
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
            {nonCopartView && <NonCopartMemberView />}

            {!nonCopartView &&
              <>
                <Box h={'150px'} display={'inline'}>
                  {otpState.isVisiable ? <EmailVerificationAnimation /> : <SignUpAnimation />}
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
                        type={
                          loginData.isBuyer ? 'signup_buyer_main_heading' : 'signup_seller_main_heading'
                        }
                        color={'brand.900'}
                        textAlign={'center'}
                      />
                    </Heading>
                    {otpState.isVisiable ?
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
                        type={loginData?.isBuyer ? 'sign_up_buyer_desc' : 'sign_up_seller_desc'}
                      />
                    }
                  </Box>
                  {otpState.isVisiable ? (
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
                  ) : (
                    <Box
                      data-testId='signup-heading'
                      as={'form'}

                    >
                      <Stack spacing={4}>
                        <Input
                          placeholder={t('copart_email')}
                          bg={'gray.100'}
                          data-testId='email-input'
                          border={0}
                          color={'gray.500'}
                          _placeholder={{
                            color: 'gray.500',
                          }}
                          value={loginData?.email}
                          onChange={(e) => setloginData({ ...loginData, email: e.target.value })}
                        />
                        <Input
                          placeholder={t('password')}
                          bg={'gray.100'}
                          data-testId='password-input'
                          border={0}
                          color={'gray.500'}
                          type='password'
                          _placeholder={{
                            color: 'gray.500',
                          }}
                          value={loginData?.password}
                          onChange={(e) => setloginData({ ...loginData, password: e.target.value })}
                        />
                        <Input
                          placeholder={t('confirm_password')}
                          bg={'gray.100'}
                          data-testId='confirm-password-input'
                          type='password'
                          border={0}
                          color={'gray.500'}
                          _placeholder={{
                            color: 'gray.500',
                          }}
                          value={loginData?.confirmPassword}
                          onChange={(e) => setloginData({ ...loginData, confirmPassword: e.target.value })}
                        />
                        {/* <Select
            data-testId='select-input'
            value={loginData.isBuyer ? '1' : '0'}
            onChange={(e) =>
              setloginData({ ...loginData, isBuyer: e.target.value === '1' ? true : false })
            }
          >
            <option value='1'>Buyer</option>
            <option value='0'>Seller</option>
          </Select> */}

                        {/* <Box mt={4}>
                          <Flex align="center" >
                            <Checkbox
                              size="lg"
                              mr={2}
                              onChange={(e) => {
                                setIsAgree(e.target.checked)
                              }}
                            />
                            <Box as="label" ml={2} display="flex" >
                              <Text>
                                <Text type='i_have_read_and_agree' fontSize={'16px'} as={'span'} />
                                <NextLink to='/terms-of-use' target='_blank'>
                                  <ChakraLink ml={1} color='#4c9aff' textDecoration={'underline'} fontSize={'16px'} fontWeight={'bold'}>
                                    Terms of Use
                                  </ChakraLink>
                                </NextLink>
                                <Text as={'span'} ml={2} mr={2} fontSize={'16px'}>and</Text>
                                <NextLink to='/privacy-policy' target='_blank'>
                                  <ChakraLink ml={1} color='#4c9aff' textDecoration={'underline'} fontSize={'16px'} fontWeight={'bold'}>
                                    Privacy Policy
                                  </ChakraLink>
                                </NextLink>
                              </Text>
                            </Box>
                          </Flex>
                        </Box> */}

                      </Stack >
                      <Button
                        fontFamily={'heading'}
                        mt={8}
                        data-testId='signup-button'
                        w={'full'}
                        bg={'brand.900'}
                        pointerEvents={ 'auto'}
                        color={'white'}
                        _hover={{
                          bg: 'brand.900',
                          boxShadow: 'xl',
                        }}
                        onClick={submitHandler}
                        isLoading={loading}
                      >
                        <Text type={'sign_up'} />
                      </Button>
                      <Stack pt={6}>
                        <Flex gap={1}>
                          <Text type='do_you_have_account_yet' />
                          <NextLink to={'/login'}>
                            <ChakraLink color={'#22662A'}>
                              <Text
                                type='login'
                                color={'brand.900'}
                              />
                            </ChakraLink>
                          </NextLink>
                        </Flex>
                      </Stack>
                    </Box >
                  )}
                </Stack>
              </>
            }
          </Stack >
        </InnerLayout>
      </MainLayout>
    </>
  )
}
