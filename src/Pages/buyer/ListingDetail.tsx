import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postNewBid } from '../../store/features/seller/sellerAction'
import { sellerApi } from '../../store/features/seller/sellerApi'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { SingleListingRes } from '../../types/listingApiTypes'
import { updateMyBidList } from '../../store/features/seller/sellerSlice'

const CarDetails = () => {
  const navigate = useNavigate()
  const token = useAppSelector((state) => state.user.userLoginInfo.token)
  const currentListing = useAppSelector((state) => state.seller.singleListing)
  const [loader, setloader] = useState(false)
  const myBids = useAppSelector((state) => state.seller.myBids)
  const currentBid = currentListing.currentBid ?? 0
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()

  const [carDetails, setCarDetails] = useState<SingleListingRes>()
  const [newBid, setnewBid] = useState(currentBid)
  const dispatch = useAppDispatch()
  const NewBidHandler = () => {
    dispatch(updateMyBidList({ id: Number(id), bid: newBid }))
    dispatch(
      postNewBid({
        listing_id: Number(id),
        amount_currency: '$',
        amount_cents: newBid,
      }),
    )
      .then(unwrapResult)
      .then(() => {
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  function getHighestBid(bids: any) {
    if (!bids || bids.length === 0) {
      return 0
    }

    let highestBid = bids[0] // Assume the first bid is the highest initially

    for (let i = 1; i < bids.length; i++) {
      if (bids[i].amount_cents > highestBid.amount_cents) {
        highestBid = bids[i] // Update the highest bid if a higher one is found
      }
    }

    return highestBid
  }
  useEffect(() => {
    setloader(true)
    sellerApi
      .getAllListingDetail(id as string, token)
      .then((res) => {
        setCarDetails(res)
        setloader(false)
      })
      .catch(() => {
        navigate('/buyer/listings')
        setloader(false)
      })
  }, [])

  const lisitngId: any = id ?? 0
  const higestbid = getHighestBid(carDetails?.bids)
  const photo_attachments = carDetails?.photo_attachments ?? []
  const max_pickup_distance = carDetails?.listing?.buyer?.max_pickup_distance ?? 0

  const getFirstImage = (photos: any) => {
    if (!photos) return '/cardPlaceholder.jpg'
    if (photos?.length === 0) return '/cardPlaceholder.jpg'
    return photos[0]?.url ?? '/cardPlaceholder.jpg'
  }

  return (
    <>
      {loader ? (
        <Box
          height={'70vh'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Box>
      ) : (
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          gap={'6'}
        >
          <Flex flexDirection={'column'}>
            <Image
              src={getFirstImage(photo_attachments)}
              objectFit={'contain'}
              width={'auto'}
              height={'30rem'}
            />
            <Flex
              pt='1.6rem'
              flexWrap={'wrap'}
              gap={'6'}
            >
              {photo_attachments.length > 1 &&
                photo_attachments.map((item: any, i: number) => (
                  <Image
                    key={i}
                    src={item?.url || '/cardPlaceholder.jpg'}
                    objectFit={'contain'}
                    width={'143px'}
                  />
                ))}
            </Flex>
          </Flex>
          <Flex flexDirection={'column'}>
            <Card maxW={{ base: 'sm', md: 'md' }}>
              <CardBody>
                <Stack mt='3'>
                  <Flex
                    gap={'6rem'}
                    alignItems={'baseline'}
                  >
                    <Flex
                      flexDirection={'column'}
                      gap={'0.1rem'}
                    >
                      <Heading
                        color={'#333'}
                        fontSize='2rem'
                        fontWeight={'700'}
                        whiteSpace={'nowrap'}
                      >
                        {carDetails?.listing.make}
                      </Heading>
                      <Text
                        as={'p'}
                        color='#9B9C9E;'
                        fontSize='0.90019rem'
                        pb={'1rem'}
                      >
                        {carDetails?.listing.model ?? ''} - {carDetails?.listing.year ?? ''}
                      </Text>
                    </Flex>
                    <Button
                      bgColor={'brand.900'}
                      py={4}
                      px={6}
                      borderRadius=' 0.34rem'
                      color='white'
                      fontSize='1rem'
                      fontWeight={'thin'}
                      disabled={!carDetails?.listing?.bidding_enabled}
                    >
                      {/* Calculating... */}
                      {carDetails?.listing?.bidding_enabled
                        ? 'Bidding Enabled'
                        : 'Bidding Disabled'}
                    </Button>
                  </Flex>
                  <Divider bgColor={'rgba(19, 19, 19, 0.13);'} />
                  <Box>
                    <Image
                      src='/Maps.png'
                      objectFit={'contain'}
                      pt={'4'}
                    />
                    <Flex
                      justifyContent={'center'}
                      alignItems={'center'}
                      alignContent={'center'}
                      p={2}
                      bgColor={'brand.900'}
                    >
                      <Text
                        color={'white'}
                        fontSize='1rem'
                        fontWeight={'700'}
                      >
                        {max_pickup_distance} Miles Away
                      </Text>
                    </Flex>
                  </Box>

                  <HStack
                    justifyContent={'space-between'}
                    pt='12'
                  >
                    <Stack>
                      <Text
                        color='black'
                        fontSize='1rem'
                        fontWeight={'normal'}
                      >
                        Highest bid:
                      </Text>
                      <Text
                        color='black'
                        fontSize='1.4rem'
                        fontWeight='700'
                      >
                        {higestbid?.amount_cents} $
                      </Text>
                    </Stack>
                    <Stack>
                      <Text
                        color='black'
                        fontSize='1rem'
                        fontWeight={'normal'}
                      >
                        Your current bid:
                      </Text>
                      <Text
                        color='black'
                        fontSize='1.4rem'
                        fontWeight='700'
                      >
                        $ {myBids[lisitngId]?.bid ?? 0}
                      </Text>
                    </Stack>
                    <Button
                      bgColor='#0054DA'
                      p={4}
                      borderRadius=' 0.34rem'
                      color='white'
                      fontSize='0.7rem'
                      onClick={() => setIsOpen(true)}
                      isDisabled={!carDetails?.listing?.bidding_enabled}
                    >
                      Increase Bid
                    </Button>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          </Flex>
        </Flex>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody maxWidth={'350px'}>
            <Text
              as={'p'}
              color='#9B9C9E'
              fontSize='1.4rem'
              pt='8'
            >
              Place your bid
            </Text>
            <Heading
              color={'#333'}
              fontSize='2rem'
              fontWeight={'700'}
              whiteSpace={'nowrap'}
              pt={'0.3rem'}
            >
              Your new bid
            </Heading>

            <Input
              borderRadius='1rem'
              border={'1px solid #E3E8ED'}
              mt='4'
              value={newBid}
              onChange={(e) => setnewBid(Number(e.target.value))}
              //   maxW='26rem'
              //   height='3rem'
              placeholder='0$'
              py='1.75rem'
              textAlign={'center'}
              _placeholder={{ color: 'black', fontSize: '1.3rem', fontWeight: '700' }}
            />
            <Button
              bgColor='#0054DA'
              p={4}
              borderRadius=' 0.36rem'
              color='white'
              fontSize='0.7rem'
              onClick={() => NewBidHandler()}
              width='100%'
              my='1.5rem'
            >
              Confirm New Bid
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default CarDetails
