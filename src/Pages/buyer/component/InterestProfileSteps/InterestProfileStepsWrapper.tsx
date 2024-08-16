import {
  Box,
  Container,
  Flex,
  GridItem,
  TabPanel,
  TabPanels,
  Tabs,
  useMediaQuery,
} from '@chakra-ui/react'
import Text from '../../../../Components/Text'
import { useEffect, useState } from 'react'
import ZipCodeAndMaximumDistanceStep from './ZipCodeAndMaximumDistanceStep'
import VehicleDetailsStep from './VehicleDetailsStep'
import MinimumBidStep from './MinimumBidStep'
import PhoneNumberStep from './PhoneNumberStep'
import { userApi } from '../../../../store/features/user/userApi'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { toast } from 'react-toastify'
import { addInterestProfile, getMyData } from '../../../../store/features/user/userAction'
import ListingTypeStep from './ListingTypeStep'
import { useNavigate } from 'react-router-dom'
import { getInterestProfile, unWrapApiError } from '../../../../helper/CommonFunction'
import ProfileAnimation from '../../../../Components/AnimatedComponents/ProfileAnimation'
import MinimumBidBuyer from '../../../../Components/AnimatedComponents/MinimumBidBuyer'
import PhoneAnimation from '../../../../Components/AnimatedComponents/PhoneAnimation'
import { useTranslation } from 'react-i18next'
import DailyMinimumBidStep from './DailyMinimumBidStep'
import { PersistPartial } from 'redux-persist/es/persistReducer'
import { UserSliceState } from '../../../../store/features/user/userSlice'

export type InterestProfileDetails = {
  companyName: string
  mobile_phone_number: string
  year_start: string
  year_end: string
  make: string
  model: string
  max_pickup_distance: number | null
  minimum_bid_daily_win_limit: string | null
  zip: string
  minimum_bid_cents: number | null
  listing_type_ids: number[]
  bid_preferences: MinimumBidFormItem[]
}

export type MinimumBidFormItem = {
  id?: number
  prefrence_id: number
  max_distance?: number | undefined
  amount_cents?: number | undefined
  amount_currency?: string | undefined
  editableMode?: boolean
}

export type InterestProfileStepProps = {
  interestProfile: InterestProfileDetails
  handleInputChange: (key: any, value: string | number) => void
  handleNextClick: () => void
  handleBackClick?: () => void
  handleSkipClick?: () => void
  handleChangeListingTypeIds?: (ids: number[]) => void
  activeTab: number
  isNextDisabled?: boolean
  isNextLoading?: boolean
  isSkipDisabled?: boolean
  isSkipLoading?: boolean
  isBackLoading?: boolean
  showBackButton?: boolean
  setInterestProfile?: (profile: InterestProfileDetails) => void
}

export default function InterestProfileStepsWrapper() {
  const [isMobile] = useMediaQuery('(max-width: 480px)')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const TopSectionItems = [
    {
      heading: 'lets_finish_creating_your_profile',
      Animation: ProfileAnimation,
    },
    {
      heading: 'enter_your_vehicle_interests',
      Animation: ProfileAnimation,
    },
    {
      heading: 'minimum_bid_buyer',
      Animation: MinimumBidBuyer,
    },
    {
      heading: 'daily_miminum_bid_limit',
      Animation: MinimumBidBuyer,
    },
    {
      heading: 'notifications',
      Animation: PhoneAnimation,
    },
    {
      heading: 'listing_types',
    },
  ]

  const userData = useAppSelector((state: { user: UserSliceState & PersistPartial }) => state.user)
  const [loading, setLoading] = useState(false)
  const [isSkipLoading, setIsSkipLoading] = useState(false)
  const token = userData?.userLoginInfo?.token
  const buyer = userData?.meData?.buyer?.buyer_info || null
  const apiInterestProfile = getInterestProfile(userData?.meData)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [interestProfile, setInterestProfile] = useState<InterestProfileDetails>({
    companyName: 'NA',
    mobile_phone_number: '',
    year_start: '',
    year_end: '',
    make: '',
    model: '',
    minimum_bid_daily_win_limit: null,
    zip: buyer?.zip?.toString() || '',
    max_pickup_distance: buyer?.max_pickup_distance || null,
    minimum_bid_cents: buyer?.minimum_bid_cents || null,
    listing_type_ids: [],
    bid_preferences:
      buyer?.bid_preferences?.map((item, index) => ({ ...item, prefrence_id: index })) || [],
  })

  const copart_dismantler: boolean = userData?.meData?.buyer?.buyer_info?.copart_dismantler || false

  useEffect(() => {
    if (buyer) {
      setInterestProfile({
        ...interestProfile,
        year_start: apiInterestProfile?.year_start === 0 ? 'All Years' : '',
        year_end: apiInterestProfile?.year_end === 0 ? 'All Years' : '',
        mobile_phone_number: apiInterestProfile?.mobile_phone_number || '',
        make: apiInterestProfile?.make || '',
        model: apiInterestProfile?.model || '',
        minimum_bid_cents: buyer?.minimum_bid_cents || null,
        max_pickup_distance: buyer?.max_pickup_distance || null,
        minimum_bid_daily_win_limit: buyer?.minimum_bid_daily_win_limit
          ? buyer?.minimum_bid_daily_win_limit.toString()
          : null,
        bid_preferences:
          buyer?.bid_preferences?.map((item) => ({ ...item, prefrence_id: item.id })) || [],
        zip: buyer?.zip?.toString() || '',
      })
    }
  }, [buyer])

  const handleInputChange = (key: any, value: string | number | MinimumBidFormItem[]) => {
    const updatedValue = key === 'zip' && value === '' ? null : value
    setInterestProfile({ ...interestProfile, [key]: updatedValue })
  }

  const handleCreateBuyer = async () => {
    if (!buyer) {
      if (!interestProfile.zip || interestProfile?.zip?.toString().length !== 5) {
        toast.error(t('please_enter_zip_with_5_digits'))
        return
      }

      if (!interestProfile.max_pickup_distance || interestProfile.max_pickup_distance <= 0) {
        toast.error(t('please_enter_valid_max_pickup_distance'))
        return
      }
      setLoading(true)
      userApi
        .createUserBasedOnType({
          token: token,
          isBuyer: true,
          max_pickup_distance: interestProfile.max_pickup_distance || 0,
          buyerZipCode: interestProfile.zip,
        })
        .then(() => {
          dispatch(getMyData({ token: token }))
            .then(() => setLoading(false))
            .catch(() => setLoading(false))
          setActiveTab((prev) => prev + 1)
        })
        .catch((error: any) => {
          unWrapApiError(error)
          setLoading(false)
        })
    } else {
      if (!interestProfile.zip || interestProfile?.zip?.toString().length !== 5) {
        toast.error(t('please_enter_zip_with_5_digits'))
        return
      }

      if (!interestProfile.max_pickup_distance || interestProfile.max_pickup_distance <= 0) {
        toast.error(t('please_enter_valid_max_pickup_distance'))
        return
      }
      const isSucces = await patchBuyer({
        max_pickup_distance: interestProfile.max_pickup_distance || 0,
        zip: interestProfile.zip,
      })

      if (isSucces) {
        setActiveTab((prev) => prev + 1)
      }
      setLoading(false)
    }
  }

  const onMinimumBidStepNext = async () => {
    if (interestProfile.bid_preferences.length === 0 || !buyer) {
      return
    }
    const createPreferences =
      interestProfile.bid_preferences.filter((item) => !item.prefrence_id) || []
    const updatePreferences =
      interestProfile.bid_preferences.filter((item) => item.prefrence_id) || []

    if (createPreferences.length > 0) {
      const payload = createPreferences.map((item) => ({
        max_distance: item.max_distance || 0,
        amount_cents: item.amount_cents || 0,
        amount_currency: 'USD',
      }))
      setLoading(true)
      await userApi.postBidPreference({ bid_preferences: payload }, token)
      setLoading(false)
    }

    if (updatePreferences.length > 0) {
      const payload = updatePreferences.map((item) => ({
        id: item.prefrence_id,
        max_distance: item.max_distance || 0,
        amount_cents: item.amount_cents || 0,
        amount_currency: 'USD',
      }))
      setLoading(true)
      await Promise.all(payload.map((item) => userApi.patchBidPreference(item.id, item, token)))
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
    }

    const payload = {
      ...interestProfile,
      minimum_bid_cents: interestProfile?.minimum_bid_cents || 100,
    }
    const isSucces = await patchBuyer(payload)
    if (isSucces) {
      setActiveTab((prev) => prev + 1)
    }
    dispatch(getMyData({ token: token }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
  }

  const onMinimumBidStepSkip = async () => {
    const payload = {
      ...interestProfile,
      minimum_bid_cents: interestProfile?.minimum_bid_cents || 100,
    }
    const isSucces = await patchBuyer(payload, true)
    if (isSucces) {
      setActiveTab((prev) => prev + 2)
    }
  }

  const onVehicleDetailsStepNext = async () => {
    if (!apiInterestProfile) {
      await createInterestProfile(interestProfile)
    }
    if (!copart_dismantler) {
      setActiveTab((prev) => prev + 3)
    } else if ((buyer?.bid_preferences?.length ?? 0) > 0 && buyer?.minimum_bid_daily_win_limit) {
      setActiveTab((prev) => prev + 3)
    } else if ((buyer?.bid_preferences?.length ?? 0) > 0) {
      setActiveTab((prev) => prev + 2)
    } else {
      setActiveTab((prev) => prev + 1)
    }
  }

  const handleChangeListingTypeIds = (ids: number[]) => {
    setInterestProfile({ ...interestProfile, listing_type_ids: ids })
  }

  const handleCompleteProfile = async () => {
    if (buyer && apiInterestProfile) {
      setLoading(true)
      const uniqueIds = interestProfile.listing_type_ids.filter(
        (value, index, self) => self.indexOf(value) === index,
      )
      await Promise.all([
        patchBuyer({
          listing_type_ids: uniqueIds || [],
          minimum_bid_cents: interestProfile?.minimum_bid_cents || 100,
          buyerZipCode: interestProfile.zip,
        }),
        userApi.updateInterestProfile(
          apiInterestProfile?.id,
          {
            year_start: interestProfile?.year_start,
            year_end: interestProfile?.year_end,
            make: interestProfile?.make,
            model: interestProfile?.model,
          },
          token,
        ),
      ])
      dispatch(getMyData({ token: token }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
    }
  }

  const createInterestProfile = async (profile: any, navigateToDashboard?: boolean) => {
    dispatch(
      addInterestProfile({
        ...profile,
        max_pickup_distance: profile.max_pickup_distance || 0,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications_enabled: false,
      }),
    ).then((response: any) => {
        dispatch(getMyData({ token: token }))
          .then(() => null)
          .catch(() => null)
        if (response?.payload && navigateToDashboard) {
          navigate('/buyer/listings')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log('err', err)
        setLoading(false)
      })
  }

  const patchBuyer = async (body: any, skipLoading?: boolean) => {
    if (!buyer) return
    try {
      if (skipLoading) {
        setIsSkipLoading(true)
      } else {
        setLoading(true)
      }
      if (body.zip) body.zip = Number(body.zip)
      await userApi.patchBuyerProfile(buyer?.id, body, token)
      if (skipLoading) {
        setIsSkipLoading(false)
        return true
      } else {
        setLoading(false)
        return true
      }
    } catch (error) {
      toast.error('Something went wrong while updating buyer profile!')
      setLoading(false)
      setIsSkipLoading(false)
      return false
    }
  }

  const TopHeadinWithAnimationSection = ({ activeTab }: { activeTab: number }) => {
    return TopSectionItems.map((item, index) => {
      if (index === activeTab) {
        return (
          <Box key={index}>
            {item.Animation && <item.Animation />}
            <Text
              type={item.heading}
              color={'brand.900'}
              textAlign={'center'}
              fontSize={isMobile ? '1.43rem' : '2.43rem'}
              fontWeight={'700'}
              textTransform={'uppercase'}
            />
          </Box>
        )
      }
    })
  }

  const onDailyMinimumBidStepNext = async () => {
    if (!buyer) {
      return
    }
    const isUpdated = await patchBuyer({
      minimum_bid_daily_win_limit: interestProfile.minimum_bid_daily_win_limit,
    })
    if (isUpdated) {
      setActiveTab((prev) => prev + 1)
    }
  }

  const onDailyMinimumBidStepSkip = async () => {
    if (!buyer) {
      return
    }
    setActiveTab((prev) => prev + 1)
  }

  const hasDailyLimit = interestProfile?.minimum_bid_daily_win_limit?.toString()?.length ?? 0 > 0

  return (
    <Container
      maxW='1440px'
      maxH={'100vh'}
      mt={10}
      mb={10}
    >
      <GridItem
        colSpan={{ base: 3, md: 2 }}
        borderRadius={10}
        boxShadow={{ base: 'md', md: 'md' }}
      >
        <>
          <TopHeadinWithAnimationSection activeTab={activeTab} />
        </>

        <Box
          borderRadius={10}
          p={{ base: 0, md: 3 }}
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
                  <ZipCodeAndMaximumDistanceStep
                    activeTab={activeTab}
                    interestProfile={interestProfile}
                    handleInputChange={handleInputChange}
                    handleNextClick={handleCreateBuyer}
                    isNextLoading={loading}
                    isNextDisabled={
                      loading ||
                      interestProfile.zip?.toString()?.length === 0 ||
                      interestProfile.max_pickup_distance?.toString()?.length === 0 ||
                      !interestProfile.zip ||
                      !interestProfile.max_pickup_distance
                    }
                  />
                </TabPanel>
                <TabPanel>
                  <VehicleDetailsStep
                    activeTab={activeTab}
                    interestProfile={interestProfile}
                    handleInputChange={handleInputChange}
                    handleNextClick={onVehicleDetailsStepNext}
                    handleBackClick={() => setActiveTab((prev) => prev - 1)}
                    isNextLoading={loading}
                    setInterestProfile={setInterestProfile}
                    isNextDisabled={
                      loading ||
                      interestProfile.year_start?.toString()?.length === 0 ||
                      interestProfile.make?.toString()?.length === 0 ||
                      interestProfile.model?.toString()?.length === 0
                    }
                  />
                </TabPanel>
                <TabPanel>
                  <MinimumBidStep
                    activeTab={activeTab}
                    interestProfile={interestProfile}
                    handleInputChange={handleInputChange}
                    handleNextClick={onMinimumBidStepNext}
                    handleSkipClick={onMinimumBidStepSkip}
                    handleBackClick={() => setActiveTab((prev) => prev - 1)}
                    isNextLoading={loading}
                    isSkipLoading={isSkipLoading}
                    isNextDisabled={
                      loading ||
                      !interestProfile.bid_preferences ||
                      interestProfile.bid_preferences?.length === 0 ||
                      interestProfile.bid_preferences.some(
                        (item) =>
                          !item.amount_cents ||
                          !item.max_distance ||
                          item.amount_cents?.toString()?.length === 0 ||
                          item.max_distance?.toString()?.length === 0,
                      )
                    }
                  />
                </TabPanel>
                <TabPanel>
                  <DailyMinimumBidStep
                    activeTab={activeTab}
                    interestProfile={interestProfile}
                    handleInputChange={handleInputChange}
                    handleNextClick={onDailyMinimumBidStepNext}
                    handleSkipClick={onDailyMinimumBidStepSkip}
                    handleBackClick={() => {
                      if (interestProfile?.bid_preferences?.length > 0) {
                        setActiveTab((prev) => prev - 2)
                      } else {
                        setActiveTab((prev) => prev - 1)
                      }
                    }}
                    isNextLoading={loading}
                    isSkipDisabled={hasDailyLimit as boolean}
                    isSkipLoading={isSkipLoading}
                    isNextDisabled={
                      loading ||
                      !interestProfile.minimum_bid_daily_win_limit ||
                      interestProfile.minimum_bid_daily_win_limit?.toString()?.length === 0
                    }
                  />
                </TabPanel>
                <TabPanel>
                  <PhoneNumberStep
                    activeTab={activeTab}
                    interestProfile={interestProfile}
                    isNextLoading={loading}
                    handleInputChange={handleInputChange}
                    handleNextClick={() => setActiveTab((prev) => prev + 1)}
                    handleBackClick={() => {
                      if (hasDailyLimit) {
                        setActiveTab((prev) => prev - 1)
                      } else if (!copart_dismantler) {
                        setActiveTab((prev) => prev - 3)
                      } else {
                        setActiveTab((prev) => prev - 2)
                      }
                    }}
                  />
                </TabPanel>
                <TabPanel>
                  <ListingTypeStep
                    activeTab={activeTab}
                    interestProfile={interestProfile}
                    isNextLoading={loading}
                    handleInputChange={handleInputChange}
                    handleChangeListingTypeIds={handleChangeListingTypeIds}
                    handleNextClick={handleCompleteProfile}
                    handleBackClick={() => setActiveTab((prev) => prev - 1)}
                    isNextDisabled={loading || !interestProfile.listing_type_ids}
                    showBackButton={false}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Box>
      </GridItem>
    </Container>
  )
}
