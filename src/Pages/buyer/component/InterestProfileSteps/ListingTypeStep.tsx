import { Box, Checkbox, Flex } from '@chakra-ui/react'
import ProfileLayoutContainerLayout from './ProfileLayoutContainerLayout'
import Text from '../../../../Components/Text'
import { InterestProfileStepProps } from './InterestProfileStepsWrapper'
import useListingTypes from '../../../../hooks/useListingTypes'

export default function ListingTypeStep({
  activeTab,
  isNextLoading,
  showBackButton,
  isNextDisabled,
  interestProfile,
  handleChangeListingTypeIds,
  handleNextClick,
}: InterestProfileStepProps) {
  const { lisitingTypes, loadingListingTypes } = useListingTypes()
  const listing_type_ids = interestProfile.listing_type_ids

  const toggleCheckbox = (id: number) => {
    if (!handleChangeListingTypeIds) return
    if (listing_type_ids.includes(id)) {
      handleChangeListingTypeIds(listing_type_ids.filter((item) => item !== id))
    } else {
      handleChangeListingTypeIds([...listing_type_ids, id])
    }
  }

  return (
    <>
      <ProfileLayoutContainerLayout
        activeTab={activeTab}
        showBackButton={showBackButton}
        isNextDisabled={isNextDisabled}
        isNextLoading={isNextLoading}
        nextButtonText='Submit'
        onNextClick={handleNextClick}
        topHeading={
          <Text
            type={'listing_types_sub_heading'}
            size='20'
            textAlign={'center'}
            color={'gray'}
          />
        }
      >
        <Flex
          flexDirection={{ base: 'column' }}
          justifyContent={'space-between'}
          pt={'2rem'}
        >
          <Box
            display={'flex'}
            flexDirection={{ base: 'row' }}
            alignItems={'center'}
            pt={'2rem'}
            sx={{
              border: '1px solid #EFEFEF',
              borderRadius: '8px',
              padding: '1.5rem 1.5rem',
              gap: '1rem',
              width: '100%',
              cursor: 'not-allowed',
              marginTop: '1rem',
            }}
          >
            <Checkbox
              size='lg'
              name={"Vehicles"}
              defaultChecked={true}
              sx={{ marginRight: '1rem' }}
              isChecked={true}
              cursor={'not-allowed'}
            />
            <Text
              type={'Vehicles'}
              size='18'
              textAlign={'center'}
              color={'gray'}
            />
          </Box>
          {!loadingListingTypes &&
            lisitingTypes.map((type, index) => (
              <Box
                key={index}
                display={'flex'}
                flexDirection={{ base: 'row' }}
                alignItems={'center'}
                pt={'2rem'}
                sx={{
                  border: '1px solid #EFEFEF',
                  borderRadius: '8px',
                  padding: '1.5rem 1.5rem',
                  gap: '1rem',
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '1rem',
                }}
                onClick={() => toggleCheckbox(type.id)}
              >
                <Checkbox
                  size='lg'
                  name={type.name}
                  defaultChecked={listing_type_ids.includes(type.id)}
                  sx={{ marginRight: '1rem' }}
                  isChecked={listing_type_ids.includes(type.id)}
                  onChange={(e) => {
                    if (!handleChangeListingTypeIds) return
                    if (!e.target.checked) {
                      handleChangeListingTypeIds([...listing_type_ids, type.id])
                    } else {
                      handleChangeListingTypeIds(listing_type_ids.filter((id) => id !== type.id))
                    }
                  }}
                />
                <Text
                  type={type.name}
                  size='18'
                  textAlign={'center'}
                  color={'gray'}
                />
              </Box>
            ))}
          <Box></Box>
        </Flex>
      </ProfileLayoutContainerLayout>
    </>
  )
}
