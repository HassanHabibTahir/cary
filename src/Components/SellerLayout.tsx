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
import { AiFillCar } from 'react-icons/ai'
import { useAppSelector } from '../store/hooks'
import Text from './Text'

interface Props {
  showSkipButton?: boolean
  showDeclineButton?: boolean
  showBackButton?: boolean
  nextButtonText?: string
  declineButtonText?: string
  onBackClick?: () => void
  onNextClick: () => void
  onSkipClick?: () => void
  onDeclineClick?: () => void
  children: ReactNode
  showYear?: boolean
  isNextDisabled?: boolean
  isNextLoading?: boolean
  submitBtnId?: string
  backBtnId?: string
  showNextButton?: boolean
}

const SellerLayout: React.FC<Props> = ({
  showSkipButton = false,
  showDeclineButton = false,
  showNextButton = true,
  showBackButton = false,
  nextButtonText = 'next',
  declineButtonText = 'decline',
  onBackClick,
  onNextClick,
  onSkipClick,
  children,
  submitBtnId,
  showYear = true,
  isNextDisabled = false,
  isNextLoading = false,
  onDeclineClick,
  backBtnId,
}) => {
  const sellerDetail = useAppSelector((state) => state.seller)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const userInfo = useAppSelector((state) => state.user)
  const model = sellerDetail.seller.enter_model
  const make = sellerDetail.seller.enter_make

  const formSteps =
    userInfo.userLoginInfo.user_type === 'Buyer' ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <Box>
      <Box
        borderBottom={'2px solid #EFEFEF'}
        bg={'white'}
      >
        {/* <Line
          percent={12 * sellerDetail?.activeTab}
          strokeWidth={0.5}
          strokeColor='#FEC809'
          trailColor='#A98405'
          style={{ borderRadius: '10px', height: 7, width: '100%' }}
        /> */}

        <Stepper
          index={sellerDetail?.activeTab}
          colorScheme='red'
          maxW={'90%'}
          margin={'0 auto'}
          flexWrap='wrap'
        >
          {formSteps.map((step, index) => (
            <Step key={index}>
              <div
                style={{
                  backgroundColor: ` ${
                    step === sellerDetail?.activeTab + 1 ? '#F1BC00' : 'initial'
                  }`,
                  height: '25px',
                  width: '25px',
                  textAlign: 'center',
                  borderRadius: '50%',
                  fontSize: '12px',
                  lineHeight: '21px',
                  fontWeight: 600,
                  border: '2.5px solid #F1BC00',
                  color: `${step === sellerDetail?.activeTab + 1 ? '#fff' : '#F1BC00'}`,
                }}
              >
                {step}
                {/* <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            /> */}
              </div>

              {/* <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box> */}

              <StepSeparator style={{ backgroundColor: '#F1BC00' }} />
            </Step>
          ))}
        </Stepper>

        {/* <Flex justifyContent={'space-between'} direction={'row'} width={'100%'}>
        {formSteps.map((el) => {
          return (
              <Badge
                style={{ backgroundColor: `${(sellerDetail?.activeTab + 1) == el ? 'yellow' : 'grey'} ` }}
                _after={ {borderRight: '1px solid yellow'} } 
              >
                {el}
              </Badge>
          )
        })}
        </Flex> */}
        <Flex
          justifyContent={'space-between'}
          mx={0}
          my={8}
        >
          {sellerDetail?.activeTab === 0 ? (
            <Text
              type='get_an_instant_offer'
              size='20'
              textAlign={'center'}
              weight='bold'
              color={'black'}
            />
          ) : (
            <Flex gap={3}>
              <AiFillCar
                size={40}
                color={isMobile ? 'white' : 'black'}
              />
              <Box>
                <Text
                  type={make ? 'make' : ''}
                  size='13'
                  color={{ base: 'white', md: 'black' }}
                />
                <Text
                  type={make ? make : ''}
                  size='17'
                  textTransform={'capitalize'}
                  textAlign={'center'}
                  weight='bold'
                  color={{ base: 'white', md: 'black' }}
                />
              </Box>
              <Box>
                <Text
                  type={model ? 'model' : ''}
                  size='13'
                  color={{ base: 'white', md: 'black' }}
                />
                <Text
                  type={model && model}
                  textTransform={'capitalize'}
                  size='17'
                  textAlign={'center'}
                  weight='bold'
                  color={{ base: 'white', md: 'black' }}
                />
              </Box>
            </Flex>
          )}
          {showYear && (
            <Box
              bg={'#FEC809'}
              p={1}
              display={{ base: 'none', md: 'flex' }}
              alignItems={{ md: 'center' }}
              height={'30px'}
              borderRadius={'8px'}
              padding={'8px 15px'}
            >
              <Text
                weight='400'
                size='16'
              >
                {`${sellerDetail?.seller?.enter_year}`}
              </Text>
            </Box>
          )}
        </Flex>
      </Box>
      <Box
        minH={550}
        py={5}
      >
        {children}
      </Box>
      <Flex
        justifyContent='space-between'
        alignItems='center'
      >
        {showSkipButton && showBackButton ? (
          <Button
            width={130}
            bg='transparent'
            colorScheme='none'
            border={'2px solid #21408E'}
            data-testId={backBtnId}
            onClick={onBackClick}
          >
            <Text
              type='back'
              size='17'
              weight='bold'
              cursor='pointer'
              color={'#21408E'}
            />
          </Button>
        ) : (
          <Box></Box>
        )}

        <Flex
          gap={6}
          alignItems='center'
        >
          {showBackButton && (
            <Button
              width={130}
              bg='transparent'
              colorScheme='none'
              data-testId={backBtnId}
              border={showSkipButton ? 'none' : '2px solid #21408E'}
              onClick={() => {
                if (showSkipButton) {
                  onSkipClick?.()
                } else {
                  onBackClick?.()
                }
              }}
            >
              <Text
                type={showSkipButton ? 'Skip' : 'back'}
                size='17'
                weight='bold'
                cursor='pointer'
                color={'#21408E'}
              />
            </Button>
          )}
          {showDeclineButton && (
            <Text
              type={declineButtonText ? declineButtonText : 'decline'}
              size='17'
              weight='bold'
              cursor='pointer'
              onClick={onDeclineClick}
              color={'red'}
            />
          )}
          {showNextButton && (
            <Button
              width={130}
              bg={'brand.900'}
              colorScheme='none'
              data-testId={submitBtnId}
              onClick={onNextClick}
              isDisabled={isNextDisabled}
              isLoading={isNextLoading}
            >
              <Text
                type={nextButtonText}
                size='17'
                color='white'
              />
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default SellerLayout
