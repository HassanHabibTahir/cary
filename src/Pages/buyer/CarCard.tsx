import { Button, Card, CardBody, HStack, Heading, Image, Stack, Text } from '@chakra-ui/react'
type Props = {
  src: string
  title: string
  year: number
  currentBid?: number
  archived?: boolean
  bidding_enabled?: boolean
  price?: number
  model?: string
}
const CarCard = ({ src, title, year, model, archived, bidding_enabled, currentBid }: Props) => {
  return (
    <Card maxW='sm'>
      <CardBody>
        <Image
          src={src}
          alt='car'
          w='100rem'
          h='15rem'
          objectFit='cover'
        />
        <Stack mt='3'>
          <HStack justifyContent={'space-between'}>
            <Heading
              color={'#333'}
              fontSize='1.4rem'
            >
              {title}
            </Heading>
            <Button
              border='1px solid #000'
              borderRadius={'0.28225rem'}
              bgColor={'white'}
              p='4'
            >
              <HStack>
                <Image src='/pair.svg' />
                <Text
                  color='#000'
                  fontWeight={'normal'}
                  fontSize='0.7rem'
                >
                  {/* {} */}
                </Text>
              </HStack>
            </Button>
          </HStack>
          <Text
            as='p'
            color='#9B9C9E;'
            fontSize='0.90019rem'
            pb={'1rem'}
          >
            ({year}) - {model ?? ''}
          </Text>
          <HStack justifyContent={'space-between'}>
            <Stack>
              <Text
                color='black'
                fontSize='1rem'
                fontWeight={'normal'}
              >
                {'Your current bid:'}
              </Text>
              <Text
                color='black'
                fontSize='1.4rem'
              >
                {currentBid} $
              </Text>
            </Stack>
            {archived ? null : (
              <Button
                bgColor={'brand.900'}
                p={4}
                borderRadius=' 0.34rem'
                color='white'
                fontSize='0.7rem'
                isDisabled={!bidding_enabled}
              >
                Increase Bid
              </Button>
            )}
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  )
}
export default CarCard
