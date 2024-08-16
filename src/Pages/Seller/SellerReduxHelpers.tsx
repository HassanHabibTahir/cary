import {
  removeAllAttachments,
  setActiveTab,
  updateAttachment,
  updateCurrentListing,
} from '../../store/features/seller/sellerSlice'
import { Attachment_Response, ResListing } from '../../types/listingApiTypes'

export const updateCurrentListingData = (listing: ResListing, dispatch: any) => {
  const newCurrentListing = {
    listing: {
      id: listing.id ?? 0,
      zip: listing.pickup_address?.zip ?? '',
      year: listing.year ?? 0,
      make: listing.make ?? '',
      title_present: listing.title_present ?? false,
      complete_item: listing.complete_item ?? false,
      status: listing.status ?? '',
      created_at: listing.created_at ?? '',
      updated_at: listing.updated_at ?? '',
      model: listing.model ?? '',
      seller_id: listing.seller_id ?? null,
      control_number: listing.control_number ?? '',
      seller_token: listing.seller_token ?? '',
      bidding_enabled: listing.bidding_enabled || false,
      jobs_scheduled: listing?.jobs_scheduled || false,
      bidding_closing_time: listing?.bidding_closing_time || null,
      buyers_fee_amount_cents: listing?.buyers_fee_amount_cents || null,
      buyers_fee_trial_waived: listing?.buyers_fee_trial_waived || null,
      pickup_address: {
        zip: listing?.pickup_address?.zip ?? '',
        street1: listing?.pickup_address?.street1 ?? '',
        street2: listing?.pickup_address?.street2 ?? '',
        state: listing?.pickup_address?.state ?? '',
        city: listing?.pickup_address?.city ?? '',
      },
    },
    registered_buyers_count: listing.winning_bid_amount_cents || 0,
  }
  dispatch(updateCurrentListing(newCurrentListing))
}

export const updatePhotoAttachments = (photo_attachments: Attachment_Response[], dispatch: any) => {
  photo_attachments.forEach((item) => {
    dispatch(updateAttachment(item))
  })
}

export const resetCurrentListing = (dispatch: any) => {
  dispatch(
    updateCurrentListing({
      listing: {
        id: 0,
        zip: '',
        year: 0,
        make: '',
        title_present: false,
        complete_item: false,
        
        status: '',
        created_at: '',
        updated_at: '',
        model: '',
        seller_id: null,
        control_number: '',
        seller_token: '',
        pickup_address: {
          zip: '',
          street1: '',
          street2: '',
          state: '',
          city: '',
        },
      },
      registered_buyers_count: 0,
    }),
  )
}

export const resetPhotoAttachments = (dispatch: any) => {
  dispatch(removeAllAttachments())
}

export const resetActiveTab = (dispatch: any) => {
  dispatch(setActiveTab(0))
}
