/* eslint-disable */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { sellerApi } from './sellerApi'
import { OfferData, AcceptOffer } from './sellerSlice'
import { AppDispatch, RootState } from '../../store'
import {
  Bid,
  CreateSeller,
  Listing,
  ListingResponse,
  ResListing,
  SellerResponse,
  SingleListingRes,
} from '../../../types/listingApiTypes'

export const sendVehicleDetailAndGetOffer = createAsyncThunk<
  OfferData,
  null,
  {
    dispatch: AppDispatch
    state: RootState
  }
>('seller/sendVehicleDetailAndGetOffer', async (_, thunkApi) => {
  try {
    const data = thunkApi.getState().seller.seller

    const response = await sellerApi.sendVehicleDetail(data)
    return response
  } catch (error) {
    console.log('error', error)
    throw error
  }
})
export const acceptOfferHandler = createAsyncThunk<AcceptOffer>(
  'seller/acceptOfferHandler',
  async () => {
    try {
      const response = await sellerApi.acceptOfferApi()
      return response
    } catch (error) {
      console.log('error', error)
      throw error
    }
  },
)
export const addListing = createAsyncThunk<ListingResponse, Listing>(
  'seller/addListing',
  async (data, thunkApi) => {
    try {
      // @ts-ignore
      const token = thunkApi?.getState()?.user?.userLoginInfo?.token || ''
      const response: ListingResponse = await sellerApi.addListing(data, token)
      return response
    } catch (error) {
      console.error('error', error) // Use console.error for error logs
      throw error
    }
  },
)
export const patchListing = createAsyncThunk<ListingResponse, Listing, { state: RootState }>(
  'seller/patchListing',
  async (data, thunkAPI) => {
    try {
      const seller = thunkAPI.getState().seller
      const response: ListingResponse = await sellerApi.patchListing(
        data,
        seller?.currentListing.listing.id,
        seller?.sellerDetail?.seller_token,
      )
      console.log('patchListingresponse', response)

      return response
    } catch (error) {
      console.error('error', error) // Use console.error for error logs
      throw error
    }
  },
)
export const postSeller = createAsyncThunk<SellerResponse, CreateSeller>(
  'seller/postSeller',
  async (data, thunkAPI) => {
    try {
      const response: SellerResponse = await sellerApi.postSeller(data)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.errors || 'An error occurred.')
    }
  },
)
export const patchSeller = createAsyncThunk<SellerResponse, CreateSeller, { state: RootState }>(
  'seller/patchSeller',
  async (data, thunkAPI) => {
    try {
      const sellerDetail = getSellerInfo(thunkAPI)
      const isLogin = thunkAPI.getState().user.isLogin
      const authToken = thunkAPI.getState().user.userLoginInfo.token
      const hederData = isLogin
        ? { Authorization: authToken }
        : { 'seller-token': sellerDetail?.seller_token }

      const response: SellerResponse = await sellerApi.patchSeller(
        data,
        sellerDetail?.id,
        hederData,
      )
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.errors || 'An error occurred.')
    }
  },
)
export const getAllListings = createAsyncThunk<ResListing[], void, { state: RootState }>(
  'seller/getAllListings',
  async (_, thunkAPI) => {
    try {
      const authToken = thunkAPI.getState().user.userLoginInfo.token

      const response: ResListing[] = await sellerApi.getAllListings(authToken)

      return response
    } catch (error: any) {
      if (!error?.response) {
        return thunkAPI.rejectWithValue('Your account is not verified. Please verify your account.')
      }

      return thunkAPI.rejectWithValue(error?.response?.data?.errors || 'An error occurred.')
    }
  },
)
export const getAllListingDetail = createAsyncThunk<
  SingleListingRes,
  { id: number },
  { state: RootState }
>('seller/getAllListingDetail', async (data, thunkAPI) => {
  try {
    const authToken = thunkAPI.getState().user.userLoginInfo.token

    const response: SingleListingRes = await sellerApi.getAllListingDetail(data.id, authToken)

    return response
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.errors || 'An error occurred.')
  }
})

export const postNewBid = createAsyncThunk<
  Bid,
  { listing_id: number; amount_currency: string; amount_cents: number },
  { state: RootState }
>('seller/postNewBid', async (data, thunkAPI) => {
  try {
    const authToken = thunkAPI.getState().user.userLoginInfo.token

    const response: Bid = await sellerApi.postBid(data, authToken)
    thunkAPI.dispatch(getAllListingDetail({ id: response?.listing_id }))
    return response
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.errors || 'An error occurred.')
  }
})

export const getSellerInfo = (thunkAPI: any) => {
  try {
    const sellerDetail =
      thunkAPI?.getState().seller.sellerDetail?.id === 0
        ? null
        : thunkAPI.getState().seller.sellerDetail
    const meData = thunkAPI?.getState()?.user?.meData || null

    if (meData) return meData?.seller?.seller_info || null

    return sellerDetail || null
  } catch (error: any) {
    return null
  }
}
