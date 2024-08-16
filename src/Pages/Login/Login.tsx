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
import { unwrapResult } from '@reduxjs/toolkit'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../Components/Text'
import { checkIfStringContainsSpaces, isValidEmail } from '../../helper/CommonFunction'
import { loginApiHandler } from '../../store/features/user/userAction'
import { useAppDispatch } from '../../store/hooks'
import { toast } from 'react-toastify'
import InnerLayout from '../signup/InnerLayout'
import MainLayout from '../../Components/Layouts/MainLayout'

export default function Login() {
  const { t } = useTranslation()
  const [loginData, setloginData] = useState({
    email: '',
    password: '',
  })

  const [loading, setloading] = useState(false)
  const dispatch = useAppDispatch()

  const submitHandler = () => {
    try {

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

      setloading(true)
      dispatch(loginApiHandler(loginData))
        .then(unwrapResult)
        .then(() => setloading(false))
        .catch(() => setloading(false))
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
                    type={'welcome_messaage_login'}
                    color={'brand.900'}
                    textAlign={'center'}
                    textTransform={'uppercase'}
                  />
                  {/* <Text
                    as={'span'}
                    bg={'brand.900'}
                    bgClip='text'
                    size='36'
                    ml={2}
                  >
                    !
                  </Text> */}
                </Heading>
                <Text
                  mt={5}
                  textAlign={'center'}
                  color={'gray.500'}
                  fontSize={{ base: 'md', sm: 'md' }}
                  type={'login_desc'}
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
                    value={loginData?.email}
                    onChange={(e) => setloginData({ ...loginData, email: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitHandler()
                      }
                    }}
                  />
                  <Input
                    placeholder={t('password')}
                    bg={'gray.100'}
                    data-testId='password-input'
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                    type='password'
                    value={loginData?.password}
                    onChange={(e) => setloginData({ ...loginData, password: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitHandler()
                      }
                    }}
                  />
                  <Box as="label" mt={2} textAlign={'center'} w={'full'}>
                    <Text textAlign={'center'}>
                      <Link to='/forgot-password'>
                        <Text type='forgotten_password' textAlign={'center'} color='#0054DA' textDecoration={'underline'} fontSize={'16px'} fontWeight={'bold'} />
                      </Link>
                    </Text>
                  </Box>
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
                  onClick={submitHandler}
                  data-testId='login-button'
                  isLoading={loading}
                >
                  Login
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
