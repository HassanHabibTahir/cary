import { createSlice } from '@reduxjs/toolkit'
import {
  loginApiHandler,
  signupApiHandler,
  addInterestProfile,
  createSellerUser,
  getMyData,
  verifySignUpCodeApiHandler,
} from './userAction'
import { toast } from 'react-toastify'
import { Interest_profile, UserResponse } from '../../../types/UserTypes'
import { MeData } from './userTypes'

export interface ILogin {
  token: string
}

export interface UserLoginInfo {
  token: string
  email?: string
  password?: string
  interest_profile_complete: boolean
  user_type: string
  user_id: number
  preferred_language?: string | null
}
export interface UserState {
  name: string
  password: string
  email: string
  phone: string
  isBuyer: boolean
  image: string
  preferred_language?: string | null
}
export interface UserSliceState {
  user: UserState
  isLogin: boolean
  userList: UserState[]
  userLoginInfo: UserLoginInfo
  userInfo: UserResponse
  interest_profile: Interest_profile
  meData: MeData | null
}

const initialState: UserSliceState = {
  interest_profile: {
    id: 0,
    mobile_phone_number: '',
    mobile_phone_verification_code: 0,
    max_pickup_distance: 0,
    year_start: 0,
    year_end: 0,
    make: '',
    model: '',
    hours_of_operation_start_time: '',
    hours_of_operation_end_time: '',
    time_zone: '',
    notifications_enabled: false,
  },
  userInfo: {
    id: 0,
    email: '',
    reset_password_sent_at: '',
    reset_password_token: '',
    user_type: '',
    interest_profile_complete: false,
    preferred_language: '',
  },
  user: {
    name: '',
    password: '',
    email: '',
    phone: '',
    isBuyer: false,
    image: '',
    preferred_language: '',
  },
  userLoginInfo: {
    token: '',
    interest_profile_complete: false,
    user_type: '',
    user_id: 0,
    preferred_language: '',
  },
  isLogin: false,
  userList: [],
  meData: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = initialState.user
      state.isLogin = false
      state.userLoginInfo = initialState.userLoginInfo
      state.userInfo = initialState.userInfo
      state.interest_profile = initialState.interest_profile
      state.meData = initialState.meData
    },
    updatePreferredLanguage: (state, action) => {
      state.user.preferred_language = action.payload
      state.userLoginInfo.preferred_language = action.payload
      if (state.meData) {
        state.meData.preferred_language = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginApiHandler.fulfilled, (state, action) => {
      state.isLogin = true
      state.userLoginInfo = action.payload
    })
    builder.addCase(loginApiHandler.rejected, (state, action) => {
      state.isLogin = false
      toast.error(action.payload as string)
    })
    builder.addCase(verifySignUpCodeApiHandler.fulfilled, (state, action) => {
      state.isLogin = true
      state.userLoginInfo = action.payload
      toast.success('Success')
    })
    builder.addCase(verifySignUpCodeApiHandler.rejected, (_, action) => {
      toast.error(action.payload as string)
    })
    builder.addCase(createSellerUser.fulfilled, (state, action) => {
      state.isLogin = true
      state.userLoginInfo = action.payload
      toast.success('Success')
    })
    builder.addCase(createSellerUser.rejected, (_, action) => {
      toast.error(action.payload as string)
    })
    builder.addCase(signupApiHandler.rejected, (_, action) => {
      toast.error(action.payload as string)
    })
    builder.addCase(addInterestProfile.rejected, (_, action) => {
      toast.error(action.payload as string)
    })
    builder.addCase(addInterestProfile.fulfilled, (state, action) => {
      state.interest_profile = action.payload
      // toast.success('Setting saved successfully')
    })
    builder.addCase(getMyData.fulfilled, (state, action) => {
      state.meData = action.payload
    })
    builder.addCase(getMyData.rejected, (state, action) => {
      const payload: any = action.payload
      state.meData = null
      if (payload?.error === 'User Not Confirmed') {
        const { token, user_id, email, password, user_type } = state.userLoginInfo
        const url = `/verify/${user_id}/${email}/${password}/${user_type}?token=${token}`
        localStorage.clear()
        window.location.href = url
      } else {
        localStorage.clear()
        logout()
        window.location.href = '/signup'
      }
    })
  },
})

// Action creators are generated for each case reducer function
export const { logout } = userSlice.actions
export const { updatePreferredLanguage } = userSlice.actions

export default userSlice.reducer
