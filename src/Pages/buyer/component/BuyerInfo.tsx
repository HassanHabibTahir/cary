import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import InputField from './Input'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { userApi } from '../../../store/features/user/userApi'
import Edit from '../Edit'
import { toast } from 'react-toastify'
import { getMyData } from '../../../store/features/user/userAction'
import useYearsMakeModels from '../../../hooks/useYearsMakeModels'
import BuyerDropdownInput from './BuyerDropdownInput'
import { useTranslation } from 'react-i18next'
import { getInterestProfile } from '../../../helper/CommonFunction'


const BuyerInfo = () => {
  const { t } = useTranslation()
  const [image, setImage] = useState('')
  const dispatch = useAppDispatch()
  const mydata = useAppSelector((state) => state.user.meData)
  const Interest_Profile = getInterestProfile(mydata)
  const buyerInfo = mydata?.buyer.buyer_info
  const token = useAppSelector((state) => state.user.userLoginInfo.token)
  const [isEditable, setIsEditable] = useState(false)
  const [interestProfileEdit, setInterestProfileEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myProfile, setmyProfile] = useState({
    first_name: buyerInfo?.first_name || '',
    last_name: buyerInfo?.last_name || '',
    buyer_number_us: buyerInfo?.buyer_number_us,
    buyer_number_uk: buyerInfo?.buyer_number_uk,
    year_start: Interest_Profile ? Interest_Profile?.year_start : 0,
    year_end: Interest_Profile ? Interest_Profile?.year_end : 0,
    make: Interest_Profile ? Interest_Profile?.make : '',
    model: Interest_Profile ? Interest_Profile?.model : '',
    max_pickup_distance: buyerInfo?.max_pickup_distance,
  })

  const { dropdowns, onYearChange, onMakeChange, fetchAllYearsMakesAndModelsTogether } =
    useYearsMakeModels()

  const years = dropdowns.years || []
  const makes = dropdowns.makes || []
  const models = dropdowns.models || []
  const [isAllYearsSelected, setIsAllYearsSelected] = useState(
    Interest_Profile.year_start === 'all years' || Interest_Profile.year_start === 0 || false,
  )
  const [isAllMakesSelected, setIsAllMakesSelected] = useState(
    Interest_Profile.make?.toLowerCase() === 'all makes' || false,
  )
  const [isAllModelsSelected, setIsAllModelsSelected] = useState(
    Interest_Profile.model?.toLowerCase() === 'all models' || false,
  )

  useEffect(() => {
    if (Interest_Profile.year_start) {
      if (
        Interest_Profile.year_start?.toString()?.toLowerCase() === 'all years' ||
        Interest_Profile.year_start === 0
      ) {
        setIsAllYearsSelected(true)
        return
      }
      fetchAllYearsMakesAndModelsTogether(Interest_Profile.year_start, Interest_Profile.make)
    }
  }, [])

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    setImage(URL.createObjectURL(file))
  }

  const handleUpdateProfile = async () => {
    if (Interest_Profile?.id) {
      try {
        setLoading(true)
        await userApi.updateInterestProfile(
          Interest_Profile?.id,
          {
            year_start: myProfile?.year_start,
            year_end: myProfile?.year_end,
            make: myProfile?.make,
            model: myProfile?.model,
          },
          token,
        )

        if (buyerInfo?.id) {
          await userApi.updateBuyerProfile(
            buyerInfo?.id,
            {
              first_name: myProfile?.first_name ?? '',
              last_name: myProfile?.last_name ?? '',
              buyer_number_us: Number(myProfile?.buyer_number_us) || 0,
              buyer_number_uk: Number(myProfile?.buyer_number_uk) || 0,
            },
            token,
          )
          setLoading(false)
        }

        dispatch(getMyData({ token: token }))
          .then(() => setLoading(false))
          .catch(() => setLoading(false))

        toast.success('Information updated!')
        setInterestProfileEdit(false)
        setLoading(false)
      } catch (error: any) {
        console.log(error)
        setLoading(false)
      } finally {
        setIsEditable(false)
      }
    }
  }
  const updateProfile = (key: string, value: string | number) => {
    setmyProfile({ ...myProfile, [key]: value })
  }

  const getEndyearsOptions = () => {
    const startYear = Number(myProfile?.year_start)
    const endYear = new Date().getFullYear()
    const years = []
    for (let i = startYear; i <= endYear; i++) {
      years.push({ label: i.toString(), value: i.toString() })
    }
    return years
  }

  return (
    <Box>
      <Text
        color='#1A202C'
        fontSize='1.4rem'
      >
        Buyer info
      </Text>
      <Flex
        gap={'2rem'}
        flexDirection={{ base: 'column', md: 'row' }}
        pt='1rem'
      >
        <Flex
          flexDirection={'column'}
          gap='1.5rem'
        >
          <Card
            textAlign={'center'}
            px='4rem'
            py='2rem'
            alignItems='center'
            maxWidth='sm'
          >
            <CardBody>
              {image ? (
                <Image
                  src={image}
                  borderRadius={'11rem'}
                  objectFit={'contain'}
                />
              ) : (
                <FormControl>
                  <FormLabel htmlFor='avatar'>
                    <Image
                      src='/user avatar.svg'
                      objectFit={'contain'}
                      position={'relative'}
                    />
                    <Edit />
                  </FormLabel>
                  <Input
                    type='file'
                    id='avatar'
                    display={'none'}
                    onChange={handleImageChange}
                  />
                </FormControl>
              )}

              <Text
                fontSize='1.14rem'
                color='#1A202C'
                pt='1rem'
                fontWeight='700'
              >
                {myProfile?.first_name + ' ' + myProfile?.last_name}
              </Text>
            </CardBody>
          </Card>
        </Flex>
        <Box>
          <Card maxWidth={{ base: 'sm', md: '34rem', lg: '50rem' }}>
            <CardHeader
              fontSize={'1.13rem'}
              color='#1A202C'
              fontWeight={'700'}
            >
              <Box
                as='span'
                pr='2'
              >
                Personal Info
              </Box>
              <Image
                src='/edit.svg'
                display='inline-block'
                verticalAlign={'middle'}
                onClick={() => setIsEditable(true)}
                style={{ cursor: 'pointer' }}
              />
            </CardHeader>
            <CardBody>
              <Flex
                gap={'1.7rem'}
                mb={'1.25rem'}
                flexDirection={{ base: 'column', lg: 'row' }}
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              >
                <InputField
                  text='First Name'
                  type='text'
                  placeholder='John'
                  disabled={!isEditable}
                  value={myProfile?.first_name}
                  onChange={(value) => updateProfile('first_name', value)}
                />
                <InputField
                  text='Last Name'
                  type='text'
                  placeholder='Doe'
                  disabled={!isEditable}
                  value={myProfile?.last_name}
                  onChange={(value) => updateProfile('last_name', value)}
                />
              </Flex>
              <Flex
                gap={'1.7rem'}
                mb={'1rem'}
                flexDirection={{ base: 'column', lg: 'row' }}
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              >
                <InputField
                  text='Buyer Number(US)'
                  type='text'
                  placeholder='709128303992'
                  value={myProfile?.buyer_number_us}
                  disabled={!isEditable}
                  onChange={(value) => updateProfile('buyer_number_us', value)}
                />
                <InputField
                  text='Buyer Number(UK)'
                  type='text'
                  placeholder='709128303992'
                  value={myProfile?.buyer_number_uk}
                  disabled={!isEditable}
                  onChange={(value) => updateProfile('buyer_number_uk', value)}
                />
              </Flex>
              <Flex
                gap={'1.7rem'}
                mb={'1.25rem'}
                flexDirection={{ base: 'column', lg: 'row' }}
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              >
                <InputField
                  text='Email'
                  type='email'
                  placeholder='Buyer@gmail.com'
                  disabled={true}
                  value={mydata?.email}
                  onChange={() => {
                  }}
                />
              </Flex>
              <Box
                as='span'
                pr='2'
                fontSize={'1.13rem'}
                color='#1A202C'
                fontWeight={'700'}
              >
                Vehicle Search Info
              </Box>
              <Image
                src='/edit.svg'
                display='inline-block'
                verticalAlign={'middle'}
                onClick={() => setInterestProfileEdit(true)}
                style={{ cursor: 'pointer' }}
              />
              <Flex
                gap={'1.7rem'}
                mb={'1rem'}
                mt={'1.25rem'}
                flexDirection={{ base: 'column', lg: 'row' }}
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              >
                <BuyerDropdownInput
                  data-testId='year_start'
                  value={isAllYearsSelected ? 'All years' : myProfile?.year_start}
                  placeholder={isAllYearsSelected ? 'All years' : t('select_year')}
                  options={years}
                  heading={'Start Year'}
                  onChange={(e: string) => {
                    onYearChange(e)
                    updateProfile('year_start', e)
                  }}
                  disabled={!interestProfileEdit || isAllYearsSelected}
                />
                <BuyerDropdownInput
                  data-testId='year_end'
                  value={isAllYearsSelected ? 'All years' : myProfile?.year_end}
                  placeholder={isAllYearsSelected ? 'All years' : t('select_year')}
                  options={getEndyearsOptions()}
                  heading={'End Year'}
                  onChange={(e: string) => {
                    updateProfile('year_end', e)
                  }}
                  disabled={!interestProfileEdit || isAllYearsSelected}
                />
              </Flex>
              <Checkbox
                size={'md'}
                mt={0}
                ml={2}
                mb={4}
                disabled={!interestProfileEdit}
                isChecked={isAllYearsSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateProfile('year_end', 'All years')
                    updateProfile('year_start', 'All years')
                    setIsAllYearsSelected(true)
                    onYearChange('1981')
                  } else {
                    updateProfile('year_end', '')
                    updateProfile('year_start', '')
                    setIsAllYearsSelected(false)
                  }
                }}
              >
                All Years
              </Checkbox>
              <Flex
                gap={'1.7rem'}
                mb={'1.25rem'}
                flexDirection={{ base: 'column', lg: 'row' }}
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <BuyerDropdownInput
                    data-testId='make'
                    value={isAllMakesSelected ? t('all_makes') : myProfile?.make}
                    placeholder={isAllMakesSelected ? t('all_makes') : 'Select Make'}
                    options={makes}
                    heading={'make'}
                    onChange={(e: string) => {
                      updateProfile('make', e)
                      if (isAllYearsSelected) {
                        onMakeChange('1981', e)
                      } else {
                        onMakeChange(myProfile.year_start, e)
                      }
                    }}
                    disabled={!interestProfileEdit || isAllMakesSelected}
                  />
                  <Checkbox
                    size={'md'}
                    mt={2}
                    ml={2}
                    mb={4}
                    disabled={!interestProfileEdit}
                    isChecked={isAllMakesSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateProfile('make', 'All Makes')
                        setIsAllMakesSelected(true)
                      } else {
                        updateProfile('make', '')
                        setIsAllMakesSelected(false)
                        onYearChange(myProfile.year_start)
                      }
                    }}
                  >
                    All Makes
                  </Checkbox>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <BuyerDropdownInput
                    data-testId='model'
                    value={isAllModelsSelected ? t('all_models') : myProfile?.model}
                    placeholder={isAllModelsSelected ? t('all_models') : 'Select Model'}
                    options={models}
                    heading={'model'}
                    onChange={(e: string) => {
                      updateProfile('model', e)
                    }}
                    disabled={!interestProfileEdit || isAllModelsSelected}
                  />
                  <Checkbox
                    size={'md'}
                    mt={2}
                    ml={2}
                    mb={4}
                    disabled={!interestProfileEdit}
                    isChecked={isAllModelsSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateProfile('model', 'All Models')
                        setIsAllModelsSelected(true)
                      } else {
                        updateProfile('model', '')
                        setIsAllModelsSelected(false)
                        if (isAllYearsSelected) {
                          onMakeChange('1981', myProfile.make)
                        } else {
                          onMakeChange(myProfile.year_start, myProfile.make)
                        }
                      }
                    }}
                  >
                    All Models
                  </Checkbox>
                </Box>
              </Flex>
              <Flex
                gap={'1.7rem'}
                mb={'1.25rem'}
              >
                <InputField
                  text='This is the maximum distance'
                  type='text'
                  placeholder='100'
                  disabled={!interestProfileEdit}
                  value={myProfile?.max_pickup_distance}
                  onChange={(value) => updateProfile('max_pickup_distance', value)}
                />
              </Flex>
            </CardBody>
          </Card>
          <HStack
            pt='1.4rem'
            justifyContent={{ base: 'center', md: 'flex-end' }}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Button
              p={4}
              borderRadius=' 0.34rem'
              color='black'
              fontSize='0.7rem'
              border='1px solid #000'
              bgColor={'white'}
              width={{ base: '100%', md: 'fit-content' }}
              onClick={() => {
                setInterestProfileEdit(false)
              }}
            >
              Cancel
            </Button>
            <Button
              bgColor={'brand.900'}
              p={4}
              borderRadius=' 0.34rem'
              color='white'
              fontSize='0.7rem'
              width={{ base: '100%', md: 'fit-content' }}
              onClick={handleUpdateProfile}
              isLoading={loading}
            >
              Update
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Box>
  )
}
export default BuyerInfo
