export interface Listing {
  year?: number | string
  zip?: string
  make?: string
  model?: string
  title_present?: boolean
  complete_item?: boolean
  status?: number
  pickup_address?: Pickup_address
  id?: number
}
interface Pickup_address {
  zip: string
  street1: string
  street2: string
  state: string
  city: string
}

export interface Buyer {
  id: number
  created_at: string
  updated_at: string
  tou_accepted_at: string
  minimum_bid_cents: number
  minimum_bid_currency: string
  copart_member_external_id: number
  buyer_number_us: number
  buyer_number_uk: number
  first_name: string | null
  last_name: string | null
  max_pickup_distance: number
  deleted_at: string | null
  is_invalid: boolean | null
  bid_preferences: any[]
  listing_types: any[]
}

export interface ResListing {
  id: number
  year: number
  zip: string
  make: string
  title_present: boolean
  complete_item: boolean
  status: string
  created_at: string
  updated_at: string
  model: string
  seller_id: number | null
  control_number: string
  seller_token: string
  pickup_address: Pickup_address
  bidding_enabled?: boolean
  winning_bid_amount_cents?: number
  distance?: number
  buyer?: Buyer
  jobs_scheduled?: boolean
  bidding_closing_time?: any
  buyers_fee_amount_cents?: any
  buyers_fee_trial_waived?: any
}
export interface Bid {
  id: number
  buyer_id: number
  listing_id: number
  amount_cents: number
  amount_currency: string
  created_at: string // You may want to use a Date type if you convert the string to a Date object
  updated_at: string // You may want to use a Date type if you convert the string to a Date object
}
export interface SingleListingRes {
  listing: ResListing
  bids: Bid[]
  currentBid?: number
  photo_attachments?: Attachment_Response[]
}
export interface ListingResponse {
  listing: ResListing
  registered_buyers_count: number
  seller_id?: number
}
export interface CreateSeller {
  id?: number
  tou_accepted_at?: string
  mobile_phone_number?: string
  user_id?: number
  contact_name?: string
  contact_email?: string
}
export interface SellerResponse {
  tou_accepted_at: string
  mobile_phone_number: string
  mobile_phone_verification_code: number
  id: number
  contact_name: string
  contact_email: string
  created_at: string
  seller_token: string
  updated_at: string
}
export interface MyBid {
  [key: number]: {
    bid: number
  }
}

export interface ParamsType {
  [key: string]: string | number | boolean
}

export interface Attachment_Response {
  id: number
  copart_uri: string
  listing_id: number
  created_at: string
  updated_at: string
  detail:
    | 'driver_front'
    | 'driver_rear'
    | 'passenger_front'
    | 'passenger_rear'
    | 'engine_compartment'
    | 'front'
    | 'back'
  attachment_url: string
}
