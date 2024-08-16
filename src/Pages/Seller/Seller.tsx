'use client'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import Text from '../../Components/Text'

import VehicleImages from './component/VehicleImages'
import WhyChoose from './component/WhyChoose'

import { useAppDispatch, useAppSelector } from '../../store/hooks'
import CarInfo from './component/CarInfo'
import OfferPage from './component/OfferPage'
import PickAndDropInfo from './component/PickAndDropInfo'
import RefrenceNumber from './component/RefrenceNumber'
import RightSideIcons from './component/RightSideIcons'
import FeltExperience from './component/FeltExperience'
import PaperWork from './component/PaperWork'
import PhoneVerification from './component/PhoneVerification'
import SignUpToSave from './component/SignUpToSave'
import StartBiddingPage from './component/StartBiddingPage'
import { useNavigate, useParams } from 'react-router-dom'
import { sellerApi } from '../../store/features/seller/sellerApi'
import { setActiveTab } from '../../store/features/seller/sellerSlice'
import { updateCurrentListingData, updatePhotoAttachments } from './SellerReduxHelpers'
import Header from '../../Components/Layouts/Header'

export default function Seller() {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const userData = useAppSelector((state) => state.user)
  const token = useAppSelector((state) => state.user.userLoginInfo.token)
  const [isLoading, setIsLoading] = useState(false)
  // const sellerData = useAppSelector((state) => state.seller)
  // const currentListing = sellerData?.currentListing ?? null
  const [loader, setloader] = useState(false)
  const activeTab = useAppSelector((state) => state.seller.activeTab)
  const data = useAppSelector((state) => state.seller)
  const isLogin = useAppSelector((state) => state.user.isLogin)
  const model = data.seller.enter_model
  const make = data.seller.enter_make
  const meData = userData?.meData

  const [aboutMyCarActive, setaboutMyCarActive] = useState(false)

  const isSideIconShow = useMemo(() => {
    return [5, 6, 7, 8].includes(activeTab)
  }, [activeTab])

  // DYNAMIC LISTING DATA WITH DYNAMIC ROUTING
  useEffect(() => {
    if (id) {
      setIsLoading(true)
      sellerApi
        .getAllListingDetail(id, token)
        .then((res) => {
          setloader(false)
          const listing = res?.listing || null
          const isBiddingEnabled = listing.bidding_enabled || false
          const isJobScheduled = res?.listing?.jobs_scheduled || false
          const isPhoneNumberAvailable =
            meData?.seller?.seller_info?.mobile_phone_number?.phone_number?.length > 0 || null

          const photo_attachments =
            res?.photo_attachments?.map((item: any) => ({
              id: item.id,
              copart_uri: item.url ?? '',
              listing_id: listing.id ?? 0,
              created_at: listing.created_at ?? '',
              updated_at: listing.updated_at ?? '',
              detail: item.detail ?? '',
              attachment_url: item?.url ?? '',
            })) || []

          // first update seller data
          if (listing) {
            updateCurrentListingData(listing, dispatch)
            setIsLoading(false)
          }
          if (photo_attachments && photo_attachments?.length > 0) {
            updatePhotoAttachments(photo_attachments, dispatch)
            setIsLoading(false)
          }

          // based on the data move to specific tab
          if (isBiddingEnabled || isJobScheduled) {
            dispatch(setActiveTab(4))
            setIsLoading(false)
            return
          }

          // if photo attachments are less than 5 then move to photo tab
          if (photo_attachments?.length < 5) {
            dispatch(setActiveTab(2))
            setIsLoading(false)
            return
          }

          // if photo attachments are greater than 5 then move to bidding tab
          if (photo_attachments?.length >= 5) {
            if (!isPhoneNumberAvailable) {
              dispatch(setActiveTab(3))
              setIsLoading(false)
            } else {
              startBidding(listing?.id?.toString())
                .then(() => {
                  dispatch(setActiveTab(4))
                  setIsLoading(false)
                })
                .catch((err) => {
                  console.log('erroooooooooo', err)
                  setIsLoading(false)
                })
            }
            return
          }
        })
        .catch(() => {
          navigate('/seller')
          setIsLoading(false)
          setloader(false)
        })
    }
  }, [id])

  const getHeaders = () => {
    if (userData?.meData) {
      return {
        Authorization: `${userData?.userLoginInfo?.token || ''} `,
      }
    }
    return {
      'seller-token': data?.sellerDetail?.seller_token ?? '',
    }
  }

  const startBidding = async (bidId: string) => {
    try {
      const headers = getHeaders()
      await sellerApi.enableBidding(bidId, headers)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Header />
      <Container
        data-testId='seller-page'
        maxW='1440px'
        mt={'3rem'}
      >
        {!loader && !isLoading && (
          <Box m={{ base: 0, md: 7 }}>
            <Grid
              templateColumns='repeat(3, 1fr)'
              gap={6}
              m={{ base: 0, md: 'auto' }}
              minH={650}
              mt={{ base: -1, md: 'none' }}
              width={'100%'}
            >
              <GridItem colSpan={{ base: 3, md: 2 }}>
                <Box
                  borderRadius={10}
                  p={{ base: 0, md: 3 }}
                  boxShadow={{ base: 'none', md: 'md' }}
                  minH={650}
                >
                  <Flex
                    minH={550}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                  >
                    <Tabs
                      index={activeTab}
                      isLazy
                    >
                      <TabPanels>
                        <TabPanel>
                          <CarInfo />
                        </TabPanel>
                        <TabPanel>
                          <WhyChoose />
                        </TabPanel>
                        <TabPanel>
                          <VehicleImages />
                        </TabPanel>
                        <TabPanel>
                          <PhoneVerification />
                        </TabPanel>
                        {isLogin ? null : (
                          <TabPanel>
                            <SignUpToSave />
                          </TabPanel>
                        )}
                        {/* <TabPanel>
                          <NoticeTimer />
                        </TabPanel> */}

                        {/* START BIDDING TABS STARTS HERE */}
                        <TabPanel>
                          <StartBiddingPage />
                        </TabPanel>
                        {/* START BIDDING TABS ENDS HERE */}

                        <TabPanel>
                          <OfferPage />
                        </TabPanel>

                        <TabPanel>
                          <PaperWork />
                        </TabPanel>
                        <TabPanel>
                          <PickAndDropInfo />
                        </TabPanel>

                        <TabPanel>
                          <RefrenceNumber />
                        </TabPanel>
                        <TabPanel>
                          <FeltExperience />
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Flex>
                </Box>
              </GridItem>
              <GridItem
                colSpan={{ base: 0, md: 1 }}
                display={{ base: 'none', md: 'block' }}
                height={'100%'}
                borderRadius={10}
                p={3}
                boxShadow={'md'}
                bg={'brand.100'}
                w={{ base: 'auto', xl: '493px' }}
              >
                {/* Two section button */}
                <Flex justifyContent={'center'}>
                  <Flex
                    alignItems={'center'}
                    width={'265px'}
                    height={'52px'}
                    bg={'#FFFFFF'}
                    borderRadius={1000}
                    p={'8px'}
                  >
                    <Flex
                      width={'100%'}
                      gap={2}
                    >
                      <Button
                        bg={aboutMyCarActive ? '#0054DA' : '#ffff'}
                        onClick={() => setaboutMyCarActive(true)}
                        w={'150px'}
                        h={'36px'}
                        borderRadius={'20px'}
                        _focus={{ bg: '#0054DA' }}
                        data-testId='about-my-car'
                      >
                        <Text
                          type='about_my_car'
                          size='14'
                          textAlign={'center'}
                          weight='600'
                          color={!aboutMyCarActive ? '#000000' : 'white'}
                        />
                      </Button>
                      <Button
                        bg={!aboutMyCarActive ? '#0054DA' : '#fff'}
                        onClick={() => setaboutMyCarActive(false)}
                        borderRadius={'20px'}
                        _focus={{ bg: '#0054DA' }}
                        h={'36px'}
                        data-testId='seller-need-help'
                      >
                        <Text
                          type='need_help'
                          size='14'
                          textAlign={'center'}
                          weight='bold'
                          color={aboutMyCarActive ? '#000000' : 'white'}
                        />
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>

                {/* green box and car image */}
                <Box
                  height={200}
                  mt={2}
                  // bg={'#27DC80'}
                  borderRadius={10}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  overflow={'hidden'}
                >
                  {/* <CircleCar /> */}
                  <Image src='/car-image.png' />
                </Box>

                {!aboutMyCarActive ? (
                  <>
                    <Text
                      weight='600'
                      size='14'
                      mt={10}
                      data-testId='seller-title'
                      type='title'
                    ></Text>
                    <Text
                      size='14'
                      mt={4}
                      data-testId='seller-desc'
                      type='title_desc'
                    ></Text>
                  </>
                ) : (
                  <>
                    <Flex
                      gap={5}
                      mt={10}
                      ml={2}
                    >
                      <Box>
                        <Text
                          data-testId='seller-make'
                          type={make ? 'make' : ''}
                          size='13'
                        />
                        <Text
                          type={make ? make : ''}
                          size='17'
                          textAlign={'center'}
                          weight='bold'
                          textTransform={'capitalize'}
                        />
                      </Box>
                      <Box>
                        <Text
                          data-testId='seller-model'
                          type={model ? 'model' : ''}
                          size='13'
                        />
                        <Text
                          type={model ? model : ''}
                          size='17'
                          textAlign={'center'}
                          weight='bold'
                          textTransform={'capitalize'}
                        />
                      </Box>
                    </Flex>

                    <Box
                      mt={5}
                      ml={2}
                    >
                      <Text size='13'>{data?.seller.enter_make}</Text>
                      {/* <Text size='13'>2.0 TDI 143 SE 4dr</Text> */}
                    </Box>
                  </>
                )}
                {isSideIconShow && <RightSideIcons testId='right-side-icons' />}
              </GridItem>
            </Grid>
          </Box>
        )}
      </Container>
    </>
  )
}
