import { Box, Checkbox, Flex, useMediaQuery } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Text from '../../../../Components/Text'
import { useTranslation } from 'react-i18next'
import BuyerDropdownInput from '../BuyerDropdownInput'
import useYearsMakeModels from '../../../../hooks/useYearsMakeModels'
import { InterestProfileStepProps } from './InterestProfileStepsWrapper'
import ProfileLayoutContainerLayout from './ProfileLayoutContainerLayout'

// DEFAULT YEARS FROM 1930 TO 1980
const getDefaultYears = () => {
  const years = []
  for (let i = 1930; i <= 1980; i++) {
    years.push({ label: i.toString(), value: i.toString() })
  }
  return years
}

const DEFAULT_YEARS = getDefaultYears()

export default function VehicleDetailsStep({
  isNextDisabled,
  activeTab,
  interestProfile,
  setInterestProfile,
  handleInputChange,
  handleNextClick,
  handleBackClick,
}: InterestProfileStepProps) {
  const { t } = useTranslation()
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  const { dropdowns, onYearChange, onMakeChange, fetchMakesOnly, fetchAllYearsMakesAndModelsTogether } =
    useYearsMakeModels()

  const years = [...DEFAULT_YEARS, ...(dropdowns.years || [])].sort((a, b) => Number(b.value) - Number(a.value)) || []
  const makes = dropdowns.makes || []
  const models = dropdowns.models || []
  const [isAllYearsSelected, setIsAllYearsSelected] = useState(false)
  const [isAllMakesSelected, setIsAllMakesSelected] = useState(false)
  const [isAllModelsSelected, setIsAllModelsSelected] = useState(false)
  const [showYearsMessage, setShowYearsMessage] = useState(false)

  useEffect(() => {
    if (isAllMakesSelected) {
      setIsAllModelsSelected(true)
      handleInputChange('model', 'All models')
    }
  }, [isAllMakesSelected])


  useEffect(() => {
    if (interestProfile.year_start?.toString().toLowerCase() === 'all years') {
      setIsAllYearsSelected(true)
    } else if (
      interestProfile.year_start?.toString().toLowerCase() !== '' &&
      interestProfile.make?.toString().toLowerCase() !== '' &&
      interestProfile.model?.toString().toLowerCase() !== ''
    ) {
      setIsAllYearsSelected(false)
      fetchAllYearsMakesAndModelsTogether(
        interestProfile.year_start?.toString() || '',
        interestProfile.make?.toString() || '',
      )
    }
    if (interestProfile.make?.toString().toLowerCase() === 'all makes') {
      setIsAllMakesSelected(true)
    } else if (interestProfile.make?.toString().toLowerCase() !== '') {
      setIsAllMakesSelected(false)
    }
    if (interestProfile.model?.toString().toLowerCase() === 'all models') {
      setIsAllModelsSelected(true)
    }
  }, [interestProfile])

  const getEndyearsOptions = () => {
    if (
      interestProfile?.year_start?.toString().toLowerCase() === 'all years' ||
      Number(interestProfile?.year_start) === 0 ||
      !interestProfile?.year_start
    ) {
      return years || []
    }

    const startYear = Number(interestProfile.year_start)
    const endYear = new Date().getFullYear()
    const tempYears = []
    for (let i = startYear; i <= endYear; i++) {
      tempYears.push({ label: i.toString(), value: i.toString() })
    }
    return tempYears
  }

  return (
    <>
      <ProfileLayoutContainerLayout
        showBackButton
        showNextButton
        isNextDisabled={isNextDisabled}
        activeTab={activeTab}
        onNextClick={handleNextClick}
        onBackClick={() => {
          if (handleBackClick) {
            handleBackClick()
          }
        }}
        topHeading={
          <Text
            type={t('please_enter_vehicle_details')}
            size='20'
            textAlign={'center'}
            color={'gray'}
          />
        }
      >
        <Text
          type={t('years')}
          color={'brand.900'}
          fontSize='1.3rem'
          fontWeight='700'
          pt='2.4rem'
        />

        <Text
          type={t('please_enter_years')}
          color='#90A3BF'
          fontSize='0.9rem'
          fontWeight='500'
          pt='0.3rem'
        />

        <Flex
          w={'100%'}
          flexDirection={{ base: 'column', md: 'row', sm: 'column' }}
          justifyContent={'space-between'}
          pt={'2rem'}
          gap={'4rem'}
        >
          <Box width={isMobile ? '100%' : '50%'}>
            <BuyerDropdownInput
              data-testId='year_start'
              value={interestProfile.year_start?.toString() || ''}
              placeholder={isAllYearsSelected ? t('all_years') : t('select_year')}
              options={years}
              heading={'from'}
              onChange={(e: string) => {
                const selectedValue = e;
                const isSelectedYearFrom1930To1980 = DEFAULT_YEARS.find(
                  (year) => year.value === selectedValue?.toString(),
                )
                if (isSelectedYearFrom1930To1980) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  setInterestProfile((prev: any) => ({ ...prev, year_start: Number(e), year_end: Number(e), make: 'All makes', model: 'All models' }))
                  setIsAllMakesSelected(true)
                  setIsAllModelsSelected(true)
                  setShowYearsMessage(true)
                } else {
                  handleInputChange('year_start', Number(e))
                  onYearChange(e)
                  setShowYearsMessage(false)
                }
              }}
              disabled={isAllYearsSelected}
            />
          </Box>
          <Box width={isMobile ? '100%' : '50%'}>
            <BuyerDropdownInput
              data-testId='year_end'
              value={isAllYearsSelected ? 'All years' : interestProfile.year_end?.toString() || ''}
              placeholder={isAllYearsSelected ? t('all_years') : t('select_year')}
              options={getEndyearsOptions()}
              heading={'to'}
              onChange={(e: string) => {
                handleInputChange('year_end', Number(e))
              }}
              disabled={isAllYearsSelected}
            />
          </Box>
        </Flex>
        {
          showYearsMessage && <Text
            color={'red.500'}
            fontSize='0.9rem'
            fontWeight='700'
            pt='0.3rem'
            pl={'0.5rem'}
            type='years_below_1980_message'
          />
        }
        <Checkbox
          size={'lg'}
          mt={2}
          ml={2}
          isChecked={isAllYearsSelected}
          onChange={(e) => {
            if (e.target.checked) {
              handleInputChange('year_end', 'All years')
              handleInputChange('year_start', 'All years')
              setIsAllYearsSelected(true)
              onYearChange('1981')
              setShowYearsMessage(false)
            } else {
              setIsAllYearsSelected(false)
              setShowYearsMessage(false)
            }
          }}
        >
          All Years
        </Checkbox>
        <Text
          color={'brand.900'}
          fontSize='1.3rem'
          fontWeight='700'
          pt='2.4rem'
          type='vehicle_details'
        />
        <Text
          color='#90A3BF'
          fontSize='0.9rem'
          fontWeight='500'
          pt='0.3rem'
          type='please_enter_vehicle_details'
        />
        <Flex
          w={'100%'}
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={'space-between'}
          pt={'2rem'}
          gap={'4rem'}
        >
          <Box width={isMobile ? '100%' : '50%'}>
            <BuyerDropdownInput
              data-testId='make'
              value={interestProfile.make}
              placeholder={isAllMakesSelected ? t('all_makes') : t('select_make')}
              options={makes}
              heading={'make'}
              onChange={(e: string) => {
                handleInputChange('make', e)
                if (isAllYearsSelected) {
                  onMakeChange('1981', e)
                } else {
                  onMakeChange(interestProfile.year_start?.toString() || '', e)
                }
              }}
              disabled={isAllMakesSelected}
            />
            <Checkbox
              size={'lg'}
              mt={2}
              ml={2}
              isChecked={isAllMakesSelected}
              onChange={(e) => {
                if (!showYearsMessage) {
                  if (e.target.checked) {
                    handleInputChange('make', 'All makes')
                    setIsAllMakesSelected(true)
                  } else {
                    handleInputChange('make', '')
                    setIsAllMakesSelected(false)
                    if (
                      interestProfile.year_start == '0' ||
                      interestProfile.year_start == 'All years'
                    ) {
                      fetchMakesOnly('1981')
                    }
                  }
                }
              }}
            >
              <Text type='all_makes' />
            </Checkbox>
          </Box>
          <Box width={isMobile ? '100%' : '50%'}>
            <BuyerDropdownInput
              data-testId='model'
              value={interestProfile.model}
              placeholder={isAllModelsSelected ? t('all_models') : t('select_model')}
              options={models}
              heading={'model'}
              onChange={(e: string) => {
                handleInputChange('model', e)
              }}
              disabled={isAllModelsSelected}
            />
            <Checkbox
              size={'lg'}
              mt={2}
              ml={2}
              isChecked={isAllModelsSelected || isAllMakesSelected}
              onChange={(e) => {
                if (!isAllMakesSelected) {
                  if (e.target.checked) {
                    handleInputChange('model', 'All models')
                    setIsAllModelsSelected(true)
                  } else {
                    handleInputChange('model', '')
                    setIsAllModelsSelected(false)
                  }
                }
              }}
            >
              <Text type='all_models' />
            </Checkbox>
          </Box>
        </Flex>
      </ProfileLayoutContainerLayout>
    </>
  )
}
