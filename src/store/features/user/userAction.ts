import { createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from './userApi'
import { UserLoginInfo } from './userSlice'
import { RootState } from '../../store'
import { Interest_profile } from '../../../types/UserTypes'
import { MeData } from './userTypes'

export const loginApiHandler = createAsyncThunk<
  UserLoginInfo,
  { email: string; password: string },
  {
    state: RootState
  }
>('auth/login', async (data, thunkAPI) => {
  try {
    const response = await userApi.loginApi(data)
    thunkAPI.dispatch(getMyData({ token: response?.token }))
    response.email = data.email
    response.password = data.password
    return response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return thunkAPI.rejectWithValue('Invalid credentials')
  }
})

export const getMyData = createAsyncThunk<
  MeData,
  { token: string },
  {
    state: RootState
  }
>('auth/meData', async (data, thunkAPI) => {
  try {
    return await userApi.getMyData(data?.token)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorResponse = {
      error: error.response?.data?.errors || 'An error occurred.',
      token: data.token,
    }
    return thunkAPI.rejectWithValue(errorResponse || 'An error occurred.')
  }
})
export const signupApiHandler = createAsyncThunk<
  UserLoginInfo,
  { email: string; isBuyer: boolean; password: string; buyerZipCode?: string }
>('auth/signup', async (data, thunkAPI) => {
  try {
    const userDetail = await userApi.signUpApi(data)
    return userDetail
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.errors[0] || 'An error occurred.')
  }
})

export const verifySignUpCodeApiHandler = createAsyncThunk<
  UserLoginInfo,
  {
    userId: string
    token: string
    code: string
    email: string
    password: string
  }
>('auth/verifySignUpCode', async (data, thunkAPI) => {
  try {
    const userDetail = await userApi.verifySignUpCode(data)
    return userDetail
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error || error.response?.data?.errors[0] || 'An error occurred.',
    )
  }
})

export const createSellerUser = createAsyncThunk<
  UserLoginInfo,
  { email: string; isBuyer: boolean; password: string },
  { state: RootState }
>('auth/createSellerUser', async (data, thunkAPI) => {
  try {
    const sellerToken = thunkAPI?.getState().seller.sellerDetail.seller_token
    const userDetail = await userApi.createSellerUser(data, sellerToken)

    return userDetail
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.errors[0] || 'An error occurred.')
  }
})

export const addInterestProfile = createAsyncThunk<
  Interest_profile,
  Interest_profile,
  { state: RootState }
>('auth/addInterestProfile', async (data, thunkAPI) => {
  try {
    const token = thunkAPI?.getState().user.userLoginInfo.token
    const response: Interest_profile = await userApi.addInterestProfile(data, token)

    return response
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.errors || 'An error occurred.')
  }
})
