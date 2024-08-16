import { useEffect, useState } from 'react'
import { InterestProfileStepProps } from './InterestProfileStepsWrapper'
import ProfileLayoutContainerLayout from './ProfileLayoutContainerLayout'
import Text from '../../../../Components/Text'
import MinimumBidForm from './MinimumBidForm'
import { Button, Flex, useBreakpointValue } from '@chakra-ui/react'

export default function MinimumBidStep({
  isNextDisabled,
  activeTab,
  interestProfile,
  isSkipLoading,
  isNextLoading,
  handleInputChange,
  handleNextClick,
  handleSkipClick,
  handleBackClick,
}: InterestProfileStepProps) {
  const [showNote, setShowNote] = useState(true)
  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    if (interestProfile.bid_preferences.length !== 0) {
      setShowNote(false)
    }
  }, [interestProfile])

  const NoteView = () => {
    return (
      <>
        <Flex
          flexDir={'column'}
          alignItems={'center'}
          mt={5}
          height={isMobile ? '100%' : 'auto'}
        >
          <Text
            mt={'8px'}
            fontSize={'16px'}
            textAlign={'center'}
            lineHeight={'30px'}
            color={'#687380'}
          >
            <Text
              as='span'
              type={'minimum_bid_desc'}
            />
          </Text>
          <Button
            width={'360px'}
            height={'62px'}
            bg={isNextLoading ? 'gray.400' : 'brand.900'}
            colorScheme='none'
            mt={'40px'}
            onClick={() => setShowNote(false)}
            disabled={isNextLoading}
          >
            <Text
              type={'interested'}
              size='22'
              color='white'
            />
          </Button>
        </Flex>
      </>
    )
  }

  return (
    <>
      <ProfileLayoutContainerLayout
        showSkipButton={
          (interestProfile?.max_pickup_distance &&
            interestProfile?.max_pickup_distance > 10)
            ? true : false}
        showBackButton
        showNextButton
        onSkipClick={handleSkipClick}
        skipButtonText='not_interested'
        nextButtonText='next'
        isNextDisabled={isNextDisabled}
        isNextLoading={isNextLoading}
        isSkipLoading={isSkipLoading}
        activeTab={activeTab}
        onNextClick={handleNextClick}
        onBackClick={() => {
          if (handleBackClick) {
            handleBackClick()
          }
        }}
      >
        {showNote ? (
          <NoteView />
        ) : (
          <MinimumBidForm
            interestProfile={interestProfile}
            handleInputChange={handleInputChange}
          />
        )}
      </ProfileLayoutContainerLayout>
    </>
  )
}
