import { SimpleGrid } from '@chakra-ui/react'
import { InterestProfileDetails } from './InterestProfileStepsWrapper'
import AttributeRowInput from './DynamicRowInput/AttributesInputForm'
import { generateRandomString } from '../../../../helper/CommonFunction'

interface MinimumBidFormProps {
  interestProfile: InterestProfileDetails
  handleInputChange: (key: any, value: any) => void
}

export default function MinimumBidForm({
  interestProfile,
  handleInputChange,
}: MinimumBidFormProps) {
  return (
    <>
      <SimpleGrid
        columns={1}
        spacing={10}
        mt={6}
      >
        <AttributeRowInput
          interestProfile={interestProfile}
          onChange={(values) => {
            const bid_preferences = values.map((item: any) => ({
              amount_cents: Number(item.amount_cents || 0),
              max_distance: Number(item.max_distance || 0),
              prefrence_id: item.prefrence_id || undefined,
              amount_currency: 'USD',
            }))
            handleInputChange('bid_preferences', bid_preferences)
          }}
          attributes={
            interestProfile.bid_preferences.map((item) => ({
              id: generateRandomString(50),
              prefrence_id: item.prefrence_id,
              max_distance: item.max_distance,
              amount_cents: item.amount_cents,
            })) || []
          }
        />
      </SimpleGrid>
    </>
  )
}
