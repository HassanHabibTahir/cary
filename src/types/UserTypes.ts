export interface UserResponse {
  id: number
  email: string
  reset_password_sent_at: string
  reset_password_token: string
  user_type: string
  interest_profile_complete: boolean
  preferred_language?: string | null
  password_digest?: string
  created_at?: string
  updated_at?: string
  buyer_id?: number | null
  seller_id?: number | null
}
export interface Interest_profile {
  id?: number
  mobile_phone_number: string
  mobile_phone_verification_code?: number
  max_pickup_distance: number
  year_start?: number | string
  year_end?: number | string
  make?: string
  model?: string
  hours_of_operation_start_time?: string
  hours_of_operation_end_time?: string
  time_zone: string
  notifications_enabled: boolean
  buyer_id?: number
}
export interface InterestProfileResponse {
  id?: number
  mobile_phone_number: string
  mobile_phone_verification_code?: number
  max_pickup_distance: number
  year_start?: number
  year_end?: number
  make?: string
  model?: string
  hours_of_operation_start_time?: string
  hours_of_operation_end_time?: string
  time_zone: string
  notifications_enabled: boolean
}
