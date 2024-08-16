import {
  Box,
  Button,
  Flex,
  Step,
  StepSeparator,
  Stepper,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import Text from '../../../../Components/Text'

interface Props {
  showSkipButton?: boolean
  skipButtonText?: string
  showBackButton?: boolean
  nextButtonText?: string
  onBackClick?: () => void
  onNextClick: () => void
  onSkipClick?: () => void
  children: ReactNode
  showYear?: boolean
  isNextDisabled?: boolean
  isSkipDisabled?: boolean
  isNextLoading?: boolean
  isBackLoading?: boolean
  isSkipLoading?: boolean
  submitBtnId?: string
  backBtnId?: string
  showNextButton?: boolean
  activeTab?: number
  topHeading?: ReactNode | string
}

const ProfileLayoutContainerLayout: React.FC<Props> = ({
  skipButtonText,
  showSkipButton = false,
  showNextButton = true,
  showBackButton = false,
  nextButtonText = 'next',
  onBackClick,
  onNextClick,
  onSkipClick,
  children,
  submitBtnId,
  isNextDisabled = false,
  isSkipDisabled = false,
  isNextLoading = false,
  isSkipLoading = false,
  isBackLoading = false,
  activeTab = 0,
  backBtnId,
  topHeading,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const formSteps = [1, 2, 3, 4, 5, 6, 7]

  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
    >
      <Box
        borderBottom={'2px solid #EFEFEF'}
        bg={'white'}
      >
        <Stepper
          index={activeTab}
          colorScheme='red'
          maxW={'90%'}
          margin={'0 auto'}
          flexWrap='wrap'
        >
          {formSteps.map((step, index) => (
            <Step key={index}>
              <div
                style={{
                  backgroundColor: ` ${step === activeTab + 1 || step <= activeTab ? '#0054DA' : 'initial'}`,
                  borderColor: `${step === activeTab + 1 || step <= activeTab ? '#0054DA' : '#E2E8F0'}`,
                  color: `${step === activeTab + 1 ? '#fff' : '#E2E8F0'}`,
                  height: '25px',
                  width: '25px',
                  textAlign: 'center',
                  borderRadius: '50%',
                  fontSize: '12px',
                  lineHeight: '21px',
                  fontWeight: 600,
                  borderWidth: '2.5px',
                  borderStyle: 'solid',
                }}
              >
                {step}
              </div>
              <StepSeparator
                style={{
                  backgroundColor: `${step === activeTab || step < activeTab ? '#0054DA' : '#E2E8F0'
                    }`,
                }}
              />
            </Step>
          ))}
        </Stepper>
        <Flex
          justifyContent={'space-between'}
          mx={0}
          my={8}
        >
          {topHeading && <Box>{topHeading}</Box>}
        </Flex>
      </Box>

      <Box
        flex='1'
        overflowY='auto'
        px={isMobile ? 0 : 4}
        marginBottom={'4rem'}
      >
        {children}
      </Box>

      <Flex
        justifyContent='flex-end'
        alignItems='center'
        position='sticky'
        bottom={0}
        bg='white'
        p={4}
        borderTop='2px solid #EFEFEF'
      >
        {showSkipButton && showBackButton && (
          <Button
            width={isMobile ? 90 : 130}
            mr={isMobile ? 5 : 0}
            // bg={isBackLoading || isSkipLoading || isNextLoading ? 'gray.400' : 'transparent'}
            colorScheme='none'
            border={'2px solid #21408E'}
            data-testId={backBtnId}
            onClick={() => {
              if (isBackLoading || isSkipLoading || isNextLoading) return
              onBackClick?.()
            }}
            isLoading={isBackLoading}
            disabled={isBackLoading || isSkipLoading || isNextLoading || isSkipDisabled}
            cursor={isBackLoading || isSkipLoading || isNextLoading ? 'not-allowed' : 'pointer'}
          >
            <Text
              type='back'
              size={isMobile ? '12' : '17'}
              weight='bold'
              color={isBackLoading || isSkipLoading || isNextLoading ? 'gray.600' : '#21408E'}
              opacity={isBackLoading || isSkipLoading || isNextLoading ? 0.5 : 1}
              cursor={isBackLoading || isSkipLoading || isNextLoading ? 'not-allowed' : 'pointer'}
            />
          </Button>
        )}

        <Flex
          gap={6}
          alignItems='center'
        >
          {showBackButton && (
            <Button
              width={isMobile ? 90 : 130}
              ml={isMobile ? 0 : 5}
              bg={isSkipLoading || isBackLoading || isNextLoading ? 'gray.400' : 'transparent'}
              colorScheme='none'
              data-testId={backBtnId}
              border={showSkipButton ? 'none' : '2px solid #21408E'}
              onClick={() => {
                if (isBackLoading || isSkipLoading || isNextLoading) return
                if (showSkipButton) {
                  onSkipClick?.()
                } else {
                  onBackClick?.()
                }
              }}
              isLoading={isSkipLoading}
              disabled={isBackLoading || isSkipLoading || isNextLoading || isSkipDisabled}
              cursor={isBackLoading || isSkipLoading || isNextLoading || isSkipDisabled ? 'not-allowed' : 'pointer'}
            >
              <Text
                type={showSkipButton ? skipButtonText || 'Skip' : 'back'}
                size={isMobile ? '12' : '17'}
                weight='bold'
                color={isBackLoading || isSkipLoading || isNextLoading || isSkipDisabled ? 'gray.600' : '#21408E'}
                opacity={isBackLoading || isSkipLoading || isNextLoading || isSkipDisabled ? 0.5 : 1}
                cursor={isBackLoading || isSkipLoading || isNextLoading || isSkipDisabled ? 'not-allowed' : 'pointer'}
              />
            </Button>
          )}
          {showNextButton && (
            <Button
              width={isMobile ? 90 : 130}
              bg={'brand.900'}
              colorScheme='none'
              data-testId={submitBtnId}
              onClick={onNextClick}
              isDisabled={
                isNextDisabled || isNextLoading || isBackLoading || isSkipLoading || isNextLoading
              }
              isLoading={isNextLoading}
            >
              <Text
                type={nextButtonText}
                size={isMobile ? '12' : '17'}
                color='white'
              />
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default ProfileLayoutContainerLayout
