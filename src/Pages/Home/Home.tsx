import { Box, Button, Flex, useBreakpointValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import CustomInput from '../../Components/CustomInput'
import Text from '../../Components/Text'
import { updatedSellerData } from '../../store/features/seller/sellerSlice'
import { useAppDispatch } from '../../store/hooks'
import Cards from './component/Cards'
import MainLayout from '../../Components/Layouts/MainLayout'

interface FormData {
  enter_reg: string
  milage: string
  postCode: string
}
const Home: React.FC = () => {
  // const { Header } = useOutletContext()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [formData, setFormData] = useState<FormData>({
    enter_reg: '',
    milage: '',
    postCode: '',
  })
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }
  const handleSubmit = () => {
    dispatch(updatedSellerData(formData))
    navigate('/seller/add')
  }
  return (
    <>
      <MainLayout>
        <Box
          bgPosition='center'
          bgRepeat='no-repeat'
          bgSize='cover'
          minH={900}
          mt={-200}
          pt={200}
        >
          <Box
            height={400}
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderBottomLeftRadius='25%'
            borderBottomRightRadius='25%'
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            p={{ base: 10, md: 0 }}
          >
            <Text
              type='home_heading'
              size={isMobile ? '25' : '57'}
              weight='bold'
              textAlign={'center'}
              lineHeight={1}
              mt={-5}
            />
            <Text
              type='home_heading_desc'
              size={isMobile ? '14' : '17'}
              textAlign={'center'}
              mt={4}
            />
            <Flex
              gap={{ base: 1, md: 3 }}
              bg={{ base: 'transparent', md: 'white' }}
              borderRadius={10}
              px={3}
              py={2}
              justifyContent={'center'}
              alignItems={'center'}
              flexDirection={{ base: 'column', md: 'row' }}
              mt={4}
            >
              <CustomInput
                labelType=''
                value={formData.enter_reg}
                onChange={(e: string) => handleInputChange('enter_reg', e)}
                placeholder={t('enter_reg')}
                bg={'white'}
              />
              <CustomInput
                labelType=''
                value={formData.milage}
                onChange={(e: string) => handleInputChange('milage', e)}
                placeholder={t('milage')}
                bg={'white'}
              />
              <CustomInput
                labelType=''
                value={formData.postCode}
                onChange={(e: string) => handleInputChange('postCode', e)}
                placeholder={t('post_code')}
                bg={'white'}
              />
              <Button
                bg={'#0334BA'}
                mt={{ base: 0, md: '-5px' }}
                width={'100%'}
                onClick={handleSubmit}
                data-testid={'get_a_quote'}
              >
                <Text
                  type='get_a_quote'
                  size='17'
                  color={'white'}
                />
              </Button>
            </Flex>
          </Box>
        </Box>
        <Cards />
      </MainLayout>
    </>
  )
}

export default Home
