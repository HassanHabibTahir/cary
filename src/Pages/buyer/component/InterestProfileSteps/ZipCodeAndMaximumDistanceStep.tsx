import { Flex } from '@chakra-ui/react'
import BuyerInput from '../BuyerInput'
import ProfileLayoutContainerLayout from './ProfileLayoutContainerLayout'
import Text from '../../../../Components/Text'
import { InterestProfileStepProps } from './InterestProfileStepsWrapper'
import { useTranslation } from 'react-i18next'

export default function ZipCodeAndMaximumDistanceStep({
  isNextLoading,
  activeTab,
  isNextDisabled,
  interestProfile,
  handleInputChange,
  handleNextClick,
}: InterestProfileStepProps) {
  const { t } = useTranslation()
  return (
    <>
      <ProfileLayoutContainerLayout
        showSkipButton
        showNextButton
        activeTab={activeTab}
        isNextLoading={isNextLoading}
        isNextDisabled={isNextDisabled}
        onNextClick={handleNextClick}
      >
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={'space-between'}
          pt={'2rem'}
        >
          <BuyerInput
            heading={t('zip_code')}
            placeholder={t('enter_zip_code')}
            type='number'
            onChange={(e: string) => handleInputChange('zip', e)}
            value={interestProfile.zip}
          />
        </Flex>
        <Flex
          flexDirection={{ base: 'column' }}
          justifyContent={'space-between'}
          pt={'2rem'}
        >
          <BuyerInput
            placeholder={t('enter_maximum_distance_in_miles')}
            heading={t('maximum_pickup_distance')}
            type='number'
            onChange={(e: string) => handleInputChange('max_pickup_distance', Number(e))}
            value={interestProfile?.max_pickup_distance || ''}
          />
          <Text
            type={t('max_pickup_desc')}
            size='14'
            color={'gray'}
            pt={'1rem'}
          />
        </Flex>
      </ProfileLayoutContainerLayout>
    </>
  )
}
