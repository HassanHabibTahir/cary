import {
  Flex,
  NumberInput,
  NumberInputField,
  useBreakpointValue,
} from '@chakra-ui/react'
import Text from '../../../../Components/Text'
import ProfileLayoutContainerLayout from './ProfileLayoutContainerLayout'
import { InterestProfileStepProps } from './InterestProfileStepsWrapper'
import { useTranslation } from 'react-i18next'

export default function DailyMinimumBidStep({
  activeTab,
  interestProfile,
  handleInputChange,
  handleNextClick,
  handleBackClick,
  handleSkipClick,
  isNextDisabled,
  isNextLoading,
  isSkipLoading,
  isSkipDisabled,
}: InterestProfileStepProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { t } = useTranslation()
  return (
    <>
      <ProfileLayoutContainerLayout
        showBackButton
        showSkipButton
        showNextButton
        onSkipClick={handleSkipClick}
        skipButtonText='no_thanks'
        nextButtonText='next'
        isNextDisabled={isNextDisabled}
        isSkipDisabled={isSkipDisabled}
        isNextLoading={isNextLoading}
        isSkipLoading={isSkipLoading}
        activeTab={activeTab}
        onNextClick={handleNextClick}
        onBackClick={() => {
          if (handleBackClick) {
            handleBackClick()
          }
        }}
        topHeading={
          <Text
            type={`daily_minimum_bid_desc`}
            size='20'
            textAlign={'center'}
            color={'gray'}
          />
        }
      >
        <>
          <Flex
            justifyContent={'center'}
            mt={4}
            h={isMobile ? '100px' : '250px'}
          >
            <Flex
              flexDirection={'column'}
              gap='0.8rem'
              w={'100%'}
            >
              <Text
                color={'brand.900'}
                fontSize={'1.12rem'}
                fontWeight={'700'}
                type='daily_limit'
              />
              <NumberInput
                width={{ base: '100%', lg: '100%' }}
                height='52px'
                fontSize='18px'
                sx={{ borderRadius: '0px' }}
                placeholder={t('enter_phone_number')}
                value={interestProfile?.minimum_bid_daily_win_limit || ''}
                onChange={(valueString) => {
                  handleInputChange('minimum_bid_daily_win_limit', valueString)
                }}
              >
                <NumberInputField />
              </NumberInput>
            </Flex>
          </Flex>
        </>
      </ProfileLayoutContainerLayout>
    </>
  )
}
