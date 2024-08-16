import { Box, Button,  Heading, Input, Stack } from '@chakra-ui/react'
// eslint-disable-next-line no-duplicate-imports
import { ChangeEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../Components/Text'
import { toast } from 'react-toastify'
import InnerLayout from '../signup/InnerLayout'
import MainLayout from '../../Components/Layouts/MainLayout'
import { userApi } from '../../store/features/user/userApi'
export default function ResetPassword() {
  const { t } = useTranslation()
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setloading] = useState(false)
  const paramsString = window.location.search;
  console.log(paramsString)
  const searchParams = new URLSearchParams(paramsString)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setError('')
  }
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== password) {
      setError('Passwords do not match')
    } else {
      setError('')
    }
    setConfirmPassword(e.target.value)
  }
  const sendCodeHandler = useCallback(async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return toast.error(`Passwords do not match`)
      }
      if ([null, undefined, ''].includes(token) || [null, undefined, ''].includes(email)) {
        return toast.error(`your link is not valid.!`)
      }
      setloading(true)
     
      const response = await userApi.resetPassword({
        email: email,
        password: password,
        token: token,
      })

      if (response?.status == 'ok') {
        toast.success('password reset successfully.!')
      
      }
      setloading(false)
    } catch (error) {
      setloading(false)
      console.log('error', error)
    }
  }, [email, token])

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
                    type={'reset_password'}
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
                  type={'reset_password_desc'}
                />
              </Box>
              <Box
                data-testId='login-form'
                as={'form'}
              >
                <Stack spacing={4}>
                  <Input
                    placeholder={t('password')}
                    data-testId='email-input'
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                    type='password'
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange(e)}
                  />
                </Stack>
                <Stack
                  spacing={4}
                  mt={5}
                >
                  <Input
                    placeholder={t('confirm-password')}
                    data-testId='email-input'
                    bg={'gray.100'}
                    border={0}
                    color={'gray.500'}
                    _placeholder={{
                      color: 'gray.500',
                    }}
                    type='password'
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleConfirmPasswordChange(e)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        sendCodeHandler()
                      }
                    }}
                  />
                </Stack>
                {error && (
                  <Text
                    mt={5}
                    textAlign={'left'}
                    color={'red'}
                    fontSize={{ base: 'md', sm: 'md' }}
                    type={error}
                  />
                )}
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
                  {t('reset_password')}
                
                </Button>
              </Box>
            </Stack>
          </Stack>
        </InnerLayout>
      </MainLayout>
    </>
  )
}
