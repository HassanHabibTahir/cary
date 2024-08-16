export interface MeData {
  id: number
  email: string
  reset_password_sent_at: string | null
  reset_password_token: string | null
  user_type: string
  interest_profile_complete: boolean
  preferred_language?: string | null
  buyer: {
    buyer_info: Buyer_Info
    interest_profiles: Interest_Profiles[]
  }
  seller: {
    seller_info: SellerInfo
    listings: Listing[]
  }
  feedbacks: Array<any>
}

type Buyer_Info = {
  id: number
  created_at: string
  updated_at: string
  tou_accepted_at: string
  minimum_bid_cents: number
  minimum_bid_currency: string
  copart_member_external_id: number
  copart_dismantler?: boolean | null | undefined
  buyer_number_us: number
  buyer_number_uk: number
  first_name: string
  last_name: string
  max_pickup_distance: number
  deleted_at: string | null
  is_invalid: boolean | null
  region_active?: boolean
  zip?: string | number | null | undefined
  minimum_bid_daily_win_limit: number | null
  bid_preferences: any[]
}

type Interest_Profiles = {
  id: number
  buyer_id: number
  mobile_phone_number: string
  mobile_phone_verification_code: string | null
  year_start: number | string
  year_end: number | string
  make: string
  model: string
  hours_of_operation_start_time: string | null
  hours_of_operation_end_time: string | null
  time_zone: string
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}
type SellerInfo = {
  id: number
  tou_accepted_at: string
  mobile_phone_number: any | null
  mobile_phone_verification_code: string | null
  contact_name: string | null
  created_at: string
  updated_at: string
  seller_token: string | null
  contact_email: string | null
  deleted_at: string | null
}

type Listing = {
  id: number
  year: number
  make: string
  title_present: boolean
  complete_item: boolean
  status: string
  created_at: string
  updated_at: string
  model: string
  seller_id: number
  control_number: string
  bidding_enabled: boolean
  jobs_scheduled: boolean
  deleted_at: string | null
  buyer_id: number | null
  winning_bid_amount_cents: number | null
}
