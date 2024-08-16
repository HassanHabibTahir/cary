import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-duplicate-imports
import { Link as ChakraLink } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../Components/Text'
import { checkIfStringContainsSpaces, isValidEmail } from '../../helper/CommonFunction'
import { toast } from 'react-toastify'
import InnerLayout from '../signup/InnerLayout'
import MainLayout from '../../Components/Layouts/MainLayout'
import { userApi } from '../../store/features/user/userApi'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [forgotPasswordData, setForgotPasswordData] = useState({
    isCodeSent: false,
    token: '',
    email: '',
    password: '',
  })

  const [loading, setloading] = useState(false)

  const sendCodeHandler = async () => {
    try {

      if (forgotPasswordData.email?.trim().length === 0) {
        toast.error(t('please_enter_email'))
        return
      }

      if (!isValidEmail(forgotPasswordData.email)) {
        toast.error(t('please_enter_valid_email'))
        return
      }

      if (checkIfStringContainsSpaces(forgotPasswordData.email)) {
        toast.error(t('please_enter_email_without_spaces'))
        return
      }

      setloading(true)
      const response = await userApi.forgotPassword({ email: forgotPasswordData.email })
      if (response) {
        setForgotPasswordData({ ...forgotPasswordData, isCodeSent: true, token: response?.token })
      }
      setloading(false)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <MainLayout>
        <InnerLayout>
          <Stack
            height={'100%'}
            width={'100%'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <Stack
              textAlign={'center'}
              width={'100%'}
              bg={'gray.50'}
              rounded={'xl'}
              p={{ base: 4, sm: 6, md: 8 }}
              spacing={{ base: 8 }}
              maxW={{ lg: 'lg' }}
            >
              <Box>
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                  display={'flex'}
                  justifyContent={'center'}
                >
                  <Text
                    size='30'
                    weight='bolder'
                    type={'forgot_password'}
                    color={'brand.900'}
                    textAlign={'center'}
                    textTransform={'uppercase'}
                  />
                </Heading>
                <Text
                  mt={5}
                  textAlign={'center'}
                  color={'gray.500'}
                  fontSize={{ base: 'md', sm: 'md' }}
                  type={'forgot_password_desc'}
                />
              </Box>
              <Box
                data-testId='login-form'
                as={'form'}
              >
                <Stack spacing={4}>
                  <Input
                    placeholder={t('email')}
                    data-testId='email-input'
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                    value={forgotPasswordData?.email}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        sendCodeHandler()
                      }
                    }}
                  />
                </Stack>
                <Button
                  fontFamily={'heading'}
                  mt={8}
                  w={'full'}
                  bg={'brand.900'}
                  color={'white'}
                  _hover={{
                    bg: 'brand.900',
                    boxShadow: 'xl',
                  }}
                  onClick={sendCodeHandler}
                  data-testId='login-button'
                  isLoading={loading}
                >
                  Forgot Password
                </Button>
                <Stack pt={6}>
                  <Flex gap={1}>
                    <Text type='do_you_have_account' />
                    <Link to={'/signup'}>
                      <ChakraLink color={'#22662A'}>
                        <Text type='sign_up_here' color={'brand.900'} />
                      </ChakraLink>
                    </Link>
                  </Flex>
                </Stack>
              </Box>
            </Stack>
          </Stack >
        </InnerLayout>
      </MainLayout>
    </>
  )
}
