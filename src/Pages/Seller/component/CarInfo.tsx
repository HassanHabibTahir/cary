// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Box, Checkbox, Flex, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import CustomInput from '../../../Components/CustomInput'
import SellerLayout from '../../../Components/SellerLayout'
import Text from '../../../Components/Text'
import { setActiveTab, updatedSellerData } from '../../../store/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { addListing, patchSeller, postSeller } from '../../../store/features/seller/sellerAction'
import { useEffect, useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import CustomDropdown from '../../../Components/CustomDropdown'
import { sellerApi } from '../../../store/features/seller/sellerApi'

enum DropdownType {
  Year = 'year',
  Make = 'make',
  Model = 'model',
}

type Options = {
  label: string
  value: string
}

type Dropdowns = {
  years: Options[]
  makes: Options[]
  models: Options[]
}

export default function CarInfo() {
  const { t } = useTranslation()
  const currentListing = useAppSelector((state) => state.seller.currentListing)
  const mydata = useAppSelector((state) => state.user.meData)
  const sellerData = useAppSelector((state) => state.seller)
  const data = useAppSelector((state) => state.seller)
  const userInfo = useAppSelector((state) => state.user)
  const listingId = currentListing?.listing?.id?.toString() || ''

  const dispatch = useAppDispatch()
  const [loading, setloading] = useState(false)
  const [terms, setterms] = useState(false)
  const [dropdowns, setdropdowns] = useState<Dropdowns>({
    years: [],
    makes: [],
    models: [],
  })

  useEffect(() => {
    const selectedYear = data?.seller?.enter_year?.toString() || ''
    const selectedMake = data?.seller?.enter_make || ''
    if (selectedYear && selectedYear?.length > 2 && selectedMake?.length > 0) {
      handleFetchByDropdownType(DropdownType.Make, selectedYear)
      fetchAllYearsMakesAndModelsTogether(selectedYear, selectedMake)
    } else if (selectedYear && selectedYear?.length > 0) {
      fetchAllYearsAndMakesTogether(selectedYear)
    } else {
      handleFetchByDropdownType(DropdownType.Year)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (key: any, value: string | number) => {
    dispatch(
      updatedSellerData({
        [key]: value,
      }),
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRadioChange = (key: any, value: boolean) => {
    dispatch(
      updatedSellerData({
        [key]: value,
      }),
    )
  }

  const onNextClick = () => {
    setloading(true)

    if (listingId == '0') {
      dispatch(
        addListing({
          year: data?.seller?.enter_year ?? 0,
          zip: data?.seller?.enter_zip ?? '',
          make: data?.seller?.enter_make ?? '',
          model: data?.seller?.enter_model ?? '',
          title_present: data?.seller?.enter_have_title ?? false,
          complete_item: data?.seller?.enter_vehicle_complete ?? false,
        }),
      )
        .then(unwrapResult)
        .then((res) => {
          console.log('res', res)
          console.log('userInfo', userInfo)
          handleNextStep()
        })
        .catch((err) => {
          console.log('err', err)
          setloading(false)
        })
    } else {
      handleNextStep()
    }
  }

  const handleNextStep = () => {
    // If user is not logged in or user is not seller then post seller then create seller
    if (!userInfo.isLogin || userInfo?.userLoginInfo?.user_type !== 'Seller') {
      console.log('inside')
      dispatch(
        postSeller({
          tou_accepted_at: new Date()?.toISOString(),
        }),
      )
        .then(unwrapResult)
        .then((result) => {
          console.log('result', result)

          setloading(false)
          dispatch(setActiveTab(1))
        })
        .catch((error) => {
          console.log('error==>', error)
          toast.error(error?.errors)
          setloading(false)
        })
    }
    // If user is logged in and user is seller then patch seller
    else if (userInfo?.meData?.user_type === 'Seller') {
      dispatch(
        patchSeller({
          id: mydata?.seller?.seller_info?.id || sellerData?.sellerDetail?.id || 0,
          tou_accepted_at: new Date()?.toISOString(),
        }),
      )
        .then(unwrapResult)
        .then(() => {
          setloading(false)
          dispatch(setActiveTab(1))
        })
        .catch((error) => {
          toast.error(error?.errors)
          setloading(false)
        })
    } else {
      setloading(false)
      dispatch(setActiveTab(1))
    }
  }

  const fetchAllYearsMakesAndModelsTogether = async (year: string, make: string) => {
    try {
      const yearsApiResponse = await sellerApi.getYears()
      const makesApiResponse = await sellerApi.getMakes(year)
      const modelsApiResponse = await sellerApi.getModels(year, make)
      const years = yearsApiResponse?.years ?? []
      const makes = makesApiResponse?.makes ?? []
      const models = modelsApiResponse?.models ?? []

      const sortedYears = years.sort((a: string, b: string) => Number(b) - Number(a))
      const removeFutureYears = sortedYears.filter(
        (item: string) => Number(item) <= new Date().getFullYear(),
      )
      setdropdowns({
        ...dropdowns,
        years: removeFutureYears.map((item: string) => ({ label: item, value: item })),
        makes: makes.map((item: string) => ({ label: item, value: item })),
        models: models.map((item: string) => ({ label: item, value: item })),
        
      })
    } catch (error) {
      console.log('something went wring while fetching years makes and models', error)
    }
  }

  const fetchAllYearsAndMakesTogether = async (year: string) => {
    try {
      const yearsApiResponse = await sellerApi.getYears()
      const makesApiResponse = await sellerApi.getMakes(year)
      const years = yearsApiResponse?.years ?? []
      const makes = makesApiResponse?.makes ?? []

      const sortedYears = years.sort((a: string, b: string) => Number(b) - Number(a))
      const removeFutureYears = sortedYears.filter(
        (item: string) => Number(item) <= new Date().getFullYear(),
      )
      setdropdowns({
        ...dropdowns,
        years: removeFutureYears.map((item: string) => ({ label: item, value: item })),
        makes: makes.map((item: string) => ({ label: item, value: item })),
      })
    } catch (error) {
      console.log('something went wring while fetching years makes and models', error)
    }
  }

  const handleFetchByDropdownType = async (
    type: DropdownType,
    year: string = '',
    make: string = '',
  ) => {
    switch (type) {
      case DropdownType.Year: {
        const yearsApiResponse = await sellerApi.getYears()
        const years = yearsApiResponse?.years ?? []
        if (years.length > 0) {
          const sortedYears = years.sort((a: string, b: string) => Number(b) - Number(a))
          const removeFutureYears = sortedYears.filter(
            (item: string) => Number(item) <= new Date().getFullYear(),
          )
          setdropdowns({
            ...dropdowns,
            years: removeFutureYears.map((item: string) => ({ label: item, value: item })),
            makes: [],
            models: [],
          })
        }
        return years
      }
      case DropdownType.Make: {
        const makesApiResponse = await sellerApi.getMakes(year)
        const makes = makesApiResponse?.makes ?? []
        if (makes.length > 0) {
          setdropdowns({
            ...dropdowns,
            makes: makes.map((item: string) => ({ label: item, value: item })),
            models: [],
          })
        }
        return makes
      }
      case DropdownType.Model: {
        const modelsApiResponse = await sellerApi.getModels(year, make)
        const models = modelsApiResponse?.models ?? []
        if (models.length > 0) {
          setdropdowns({
            ...dropdowns,
            models: models.map((item: string) => ({ label: item, value: item })),
          })
        }
        return models
      }
      default:
        return ''
    }
  }

  return (
    <SellerLayout
      submitBtnId={'infoSubmit'}
      onNextClick={onNextClick}
      showYear={false}
      isNextLoading={loading}
      isNextDisabled={
        !terms ||
        data?.seller?.enter_zip === '' ||
        data?.seller?.enter_make === '' ||
        data?.seller?.enter_model === ''
      }
    >
      <Text
        type='hey_there'
        size='17'
        data-testId='info-hey-there'
        weight='bold'
        mb={5}
      />
      <Text
        type='hey_there_desc'
        size='17'
        mb={5}
      />
      <Flex
        gap={3}
        flexWrap={'wrap'}
        mb={3}
      >
        <CustomInput
          testId='enter-zip'
          labelType=''
          value={data?.seller?.enter_zip ?? ''}
          onChange={(e: string) => {
            handleInputChange('enter_zip', e)
          }}
          placeholder={t('enter_zip')}
          width={{ base: '100%', lg: '48%' }}
          minW='0px'
        />
        <Box
          w={{ base: '100%', lg: '48%' }}
          sx={{
            'media (max-width: 767px)': {
              width: '100%',
            },
          }}
        >
          <CustomDropdown
            data-testId='enter-year'
            labelType=''
            value={data?.seller?.enter_year?.toString() ?? ''}
            onChange={(e: string) => {
              handleInputChange('enter_year', Number(e))
              handleFetchByDropdownType(DropdownType.Make, e)
              setdropdowns({
                ...dropdowns,
                makes: [],
                models: [],
              })
            }}
            placeholder={t('enter_year')}
            minW='0px'
            options={dropdowns.years}
          />
        </Box>

        <Box
          w={{ base: '100%', lg: '48%' }}
          sx={{
            'media (max-width: 767px)': {
              width: '100%',
            },
          }}
        >
          <CustomDropdown
            labelType=''
            value={data?.seller?.enter_make ?? ''}
            disabled={dropdowns.years.length === 0}
            onChange={(e: string) => {
              handleInputChange('enter_make', e)
              handleFetchByDropdownType(
                DropdownType.Model,
                data?.seller?.enter_year?.toString() ?? '',
                e,
              )
            }}
            placeholder={t('enter_make')}
            minW='0px'
            options={dropdowns.makes}
          />
        </Box>

        <Box
          w={{ base: '100%', lg: '48%' }}
          sx={{
            'media (max-width: 767px)': {
              width: '100%',
            },
          }}
        >
          <CustomDropdown
            labelType=''
            value={data?.seller?.enter_model ?? ''}
            disabled={dropdowns.makes.length === 0}
            onChange={(e: string) => {
              handleInputChange('enter_model', e)
            }}
            placeholder={t('enter_model')}
            minW='0px'
            options={dropdowns.models}
          />
        </Box>
      </Flex>
      <Box
        bg={'#F9FAFB'}
        borderRadius={10}
        py={6}
        px={6}
        my={5}
      >
        <Box my={2}>
          <RadioGroup
            data-testId='radio-group'
            value={data?.seller?.enter_have_title ? '1' : '2'}
          >
            <Stack direction='row'>
              <Text
                type='enter_have_title'
                size='17'
                w={300}
              />
              <Radio
                value={'1'}
                onChange={() => handleRadioChange('enter_have_title', true)}
              >
                <Text
                  type='yes'
                  size='17'
                />
              </Radio>
              <Radio
                value='2'
                onChange={() => handleRadioChange('enter_have_title', false)}
              >
                <Text
                  type='no'
                  size='17'
                />
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>

        <Box my={2}>
          <RadioGroup value={data?.seller?.enter_vehicle_complete ? '1' : '2'}>
            <Stack direction='row'>
              <Text
                type='enter_vehicle_complete'
                size='17'
                w={300}
              />
              <Radio
                value={'1'}
                onChange={() => handleRadioChange('enter_vehicle_complete', true)}
              >
                <Text
                  type='yes'
                  size='17'
                />
              </Radio>
              <Radio
                value='2'
                onChange={() => handleRadioChange('enter_vehicle_complete', false)}
              >
                <Text
                  type='no'
                  size='17'
                />
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Flex
          mt={5}
          alignItems={'flex-start'}
          gap={2}
        >
          <Checkbox
            checked={terms}
            onChange={(e) => setterms(e.target.checked)}
            size={'lg'}
            mt={1}
          />
          <Text
            type='lorem'
            size='17'
            textAlign={'left'}
          />
        </Flex>
      </Box>
    </SellerLayout>
  )
}
