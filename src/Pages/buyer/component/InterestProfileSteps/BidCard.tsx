import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Flex,
  NumberInput,
  NumberInputField,
  useBreakpointValue,
} from '@chakra-ui/react'
import Text from '../../../../Components/Text'
import { toast } from 'react-toastify'
import { InterestProfileDetails } from './InterestProfileStepsWrapper'
import CustomDropdown, { OptionType } from '../../../../Components/CustomDropdown'
import { useTranslation } from 'react-i18next'

type BidCardProps = {
  onChange: (miles: number, bid_amount: number) => void
  onRemoveItem: () => void
  selectedMiles?: number
  selectedBidAmount?: number
  interestProfile: InterestProfileDetails
  loading?: boolean
}

export default function BidCard({
  onChange,
  onRemoveItem,
  selectedMiles,
  selectedBidAmount,
  interestProfile,
  loading,
}: BidCardProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { t } = useTranslation()
  const format = (val: string) => `$` + val
  const parse = (val: string) => val.replace(/^\$/, '')
  const [miles, setMiles] = useState<number | undefined>(undefined)
  const [bid_amount, setBidAmount] = useState<number | undefined>(undefined)
  const [enableView, setEnableView] = useState<boolean>(true)
  const formattedAmount = Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
    bid_amount || 0,
  )
  const maxPickupDistance = interestProfile?.max_pickup_distance || 0

  useEffect(() => {
    setMiles(selectedMiles)
    setBidAmount(selectedBidAmount)
  }, [selectedMiles, selectedBidAmount])

  const onSave = () => {
    if (!miles || miles <= 0) {
      toast.error(t('please_enter_miles'))
      return
    } else if (!bid_amount || bid_amount <= 0) {
      toast.error(t('please_enter_bid_amount'))
      return
    } else if (!interestProfile) {
      toast.error(t('please_enter_max_pickup'))
      return
    } else if (
      ((miles as number) > (maxPickupDistance || 0)) as unknown as number
    ) {
      toast.error(`${t('distance_must_be_less')}${maxPickupDistance} ${t('miles')} `,
      )
      return
    } else {
      setEnableView(false)
      onChange(miles, bid_amount)
    }
  }

  const onRemove = () => {
    setMiles(undefined)
    setBidAmount(undefined)
    setEnableView(true)
    onRemoveItem()
  }

  const btnBgColor = loading ? 'gray.300' : '#3182CE'

  const options = () => {
    // starts from 10 and goes till maxPickupDistance and if in last maxPickupDistance is not divisible by 10 we can show same maxPickupDistance
    const options = []
    for (let i = 10; i <= maxPickupDistance; i += 10) {
      options.push({ value: i?.toString(), label: i.toString() + ' miles'})
    }
    if (maxPickupDistance % 10 !== 0) {
      options.push({ value: maxPickupDistance, label: maxPickupDistance.toString() + ' miles'})
    }
    return options
  }

  const DISTACE_OPTIONS = options()

  return (
    <>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
      >
        <CardBody w={'100%'}>
          <Flex
            direction={'row'}
            w={'100%'}
            justifyContent={'space-between'}
          >
            <Flex
              direction={'column'}
              width={'100%'}
              mr={4}
            >
              <Text
                color='#1A202C'
                fontSize={isMobile ? '0.8rem' : '1.12rem'}
                fontWeight={'600'}
                mb={4}
                type='upto_miles'
              >

              </Text>
              <CustomDropdown
                isDisabled={!enableView}
                disabled={!enableView || loading}
                placeholder=''
                onChange={(value) => setMiles(Number(value))}
                value={miles?.toString() || ''}
                width={{ base: '100%', lg: '100%' }}
                height='52px'
                fontSize='18px'
                borderRadius={'7px'}
                options={DISTACE_OPTIONS as OptionType[]}
                labelType={''}
              />
              {/* <NumberInput
                isDisabled={!enableView}
                placeholder='Miles'
                onChange={(valueString) => setMiles(Number(parse(valueString)))}
                value={miles || ''}
                width={{ base: '100%', lg: '100%' }}
                height='52px'
                fontSize='18px'
                sx={{ borderRadius: '0px' }}
              >
                <NumberInputField placeholder='Miles' />
              </NumberInput> */}
            </Flex>
            <Flex
              direction={'column'}
              width={'100%'}
            >
              <Text
                color='#1A202C'
                fontSize={isMobile ? '0.8rem' : '1.12rem'}
                fontWeight={'600'}
                mb={4}
                type='automatic_minimum_bid'
              >

              </Text>
              <NumberInput
                isDisabled={!enableView}
                placeholder='$0.00'
                onChange={(valueString) => setBidAmount(Number(parse(valueString)))}
                value={format(formattedAmount?.toString() || '') || ''}
                width={{ base: '100%', lg: '100%' }}
                height='52px'
                fontSize='18px'
                sx={{ borderRadius: '0px' }}
              >
                <NumberInputField placeholder='$0.00' />
              </NumberInput>
            </Flex>
          </Flex>
          <Flex
            mt={4}
            justifyContent={'flex-end'}
          >
            {enableView ? (
              <>
                <Button
                  variant='solid'
                  colorScheme='red'
                  mr={3}
                  w={isMobile ? '50%' : '20%'}
                  onClick={onRemove}
                  disabled={loading}
                >
                  Remove
                </Button>
                <Button
                  variant='solid'
                  colorScheme='blue'
                  w={isMobile ? '50%' : '20%'}
                  onClick={onSave}
                  disabled={loading}
                  bg={btnBgColor}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='solid'
                  colorScheme='blue'
                  w={isMobile ? '50%' : '20%'}
                  disabled={loading}
                  bg={btnBgColor}
                  onClick={() => {
                    setEnableView(true)
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  )
}
