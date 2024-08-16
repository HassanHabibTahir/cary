'use client'
import { Stack, Button, Image, Box, Flex, Tag } from '@chakra-ui/react'
import Text from '../../Components/Text'
import { useNavigate } from 'react-router-dom'
import { setInitialState } from '../../store/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect } from 'react'
import { resetActiveTab, resetCurrentListing, resetPhotoAttachments } from './SellerReduxHelpers'
import Header from '../../Components/Layouts/Header'

export default function Sellerlist() {
  const navigate = useNavigate()
  const userData = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const allListings = userData?.meData?.seller?.listings || []
  const checkIfInterestProfileCompleted = () => {
    return (
      userData?.meData?.interest_profile_complete ||
      userData?.userLoginInfo?.interest_profile_complete ||
      false
    )
  }

  const getFirstImage = (item: any) => {
    try {
      if (!item) return '/cardPlaceholder.jpg'
      if (item?.photo_attachments?.length === 0) return '/cardPlaceholder.jpg'
      return item?.photo_attachments[0]?.url ?? '/cardPlaceholder.jpg'
    } catch (error) {
      return '/cardPlaceholder.jpg'
    }
  }

  const isInterestProfileCompleted = checkIfInterestProfileCompleted()

  useEffect(() => {
    resetActiveTab(dispatch)
    resetCurrentListing(dispatch)
    resetPhotoAttachments(dispatch)
  }, [])

  const getColor = (status: string) => {
    if (status === 'draft') {
      return 'red'
    } else if (status === 'waiting') {
      return 'yellow'
    } else if (status === 'live') {
      return 'green'
    } else if (status === 'open') {
      return 'teal'
    } else {
      return 'red'
    }
  }

  const SellerCard = ({ listItem }: { listItem: any }) => {
    return (
      <Stack
        data-testId='seller-item'
        p='4'
        boxShadow='lg'
        m='4'
        borderRadius='sm'
        _hover={{
          boxShadow: 'xl',
          cursor: 'pointer',
        }}
        onClick={() => {
          navigate(`/live/${listItem?.control_number}`)
        }}
      >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justifyContent='space-between'
        >
          <Stack direction={{ base: 'column', md: 'row' }}>
            <Image
              src={getFirstImage(listItem)}
              width={{ base: 400, md: 150 }}
            />
            <Flex direction={'column'}>
              <Flex direction={'row'}>
                <Text
                  fontSize={{ base: 'sm' }}
                  textAlign={'left'}
                  maxW={'4xl'}
                  mt={3}
                >
                  Make : {listItem.make}
                </Text>
                <Tag
                  size={'sm'}
                  variant='solid'
                  ml={3}
                  mt={3}
                  colorScheme={getColor(listItem?.status?.toLowerCase())}
                >
                  {listItem?.status?.split('_')?.join(' ')?.toUpperCase() || ''}
                </Tag>
              </Flex>

              <Text
                fontSize={{ base: 'sm' }}
                textAlign={'left'}
                maxW={'4xl'}
                mt={1}
              >
                Model : {listItem.model} {listItem.year}
              </Text>
              <Text
                fontSize={{ base: 'sm' }}
                textAlign={'left'}
                maxW={'4xl'}
                mt={1}
              >
                Year : {listItem.year}
              </Text>
            </Flex>
          </Stack>
          {listItem?.winning_bid_amount_cents && (
            <Stack direction={{ base: 'column', md: 'row' }}>
              <Text fontSize={20}>Bid:</Text>
              <Text
                fontSize={20}
                fontWeight={'bold'}
              >
                {listItem?.winning_bid_amount_cents || 0} $
              </Text>
            </Stack>
          )}
        </Stack>
      </Stack>
    )
  }

  return (
    <>
      <Header />
      <Box
        minH={'100vh'}
        pt={'3rem'}
      >
        <Stack
          direction='row'
          alignItems='center'
          justifyContent={'space-between'}
          mx={5}
          mt={5}
          data-testId='seller-list'
        >
          <Button
            bgColor='brand.900'
            data-testId='become-a-buyer-button'
            onClick={() => navigate('/buyer')}
          >
            <Text
              color={'white'}
              type={!isInterestProfileCompleted ? 'become_a_buyer' : 'switch_to_buyer_view'}
            />
          </Button>
          <Button
            bgColor='brand.900'
            data-testId='add-vehicle-button'
            onClick={() => {
              dispatch(setInitialState())
              navigate('/seller/add')
            }}
          >
            <Text
              type={'add_vehicle'}
              color={'white'}
            />
          </Button>
        </Stack>
        {allListings?.length === 0 ? (
          <Flex
            height={'40vh'}
            justifyContent={'center'}
            alignContent={'center'}
          >
            <Image src='/noRecord.png' />
          </Flex>
        ) : (
          <>
            <Stack
              data-testId='seller-item'
              p='4'
              pb='2'
              m='4'
              borderRadius='sm'
            >
              <Text
                data-testId='why-choose'
                type='my_listings'
                size='30'
                weight='bold'
              />
            </Stack>
            <hr />

            {allListings?.map((list) => (
              <SellerCard
                key={list.id}
                listItem={list}
              />
            ))}
          </>
        )}
      </Box>
    </>
  )
}
