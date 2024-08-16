import { WaitHandler } from '../../../helper/CommonFunction'
import { apiAxios } from '../../../helper/apiConfig'
import {
  Bid,
  CreateSeller,
  Listing,
  ListingResponse,
  ResListing,
  SellerResponse,
  SingleListingRes,
} from '../../../types/listingApiTypes'
import { SellerState } from './sellerSlice'

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to generate a random alphanumeric string of a given length
function getRandomAlphaNumeric(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

async function sendVehicleDetail(_: SellerState) {
  // await WaitHandler(3)
  const response = {
    price: getRandomNumber(500, 1000).toString(),
    deliverydays: '24',
  }

  return response
}
async function acceptOfferApi() {
  // await WaitHandler(3)

  return {
    refrenceNumber: getRandomAlphaNumeric(9).toUpperCase(),
  }
}
async function sendVerificationCode() {
  await WaitHandler(3)

  return true
}
async function verifyCode(code: string) {
  await WaitHandler(3)

  return code === '123456'
}
async function addListing(data: Listing, token: string): Promise<ListingResponse> {
  try {
    const res = await apiAxios.post(
      '/listings',
      { listing: data },
      {
        headers: {
          Authorization: token,
        },
      },
    )

    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}
async function patchListing(
  data: Listing,
  id: number,
  seller_token: string,
): Promise<ListingResponse> {
  try {
    const res = await apiAxios.patch(
      `/listings/${id}`,
      { listing: data },
      {
        headers: {
          'seller-token': seller_token,
        },
      },
    )

    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}
async function postSeller(data: CreateSeller): Promise<SellerResponse> {
  const res = await apiAxios.post('/sellers', { seller: data })

  return res.data
}
async function patchSeller(
  data: CreateSeller,
  id: number,
  hederData: any,
): Promise<SellerResponse> {
  const res = await apiAxios.patch(
    `/sellers/${id}`,
    { seller: data },
    {
      headers: hederData,
    },
  )

  return {
    ...res.data,
    mobile_phone_verification_code: data?.mobile_phone_number ? '123456' : '',
  }
}
async function feedBack(data: {
  body: string
  listing_id?: number | null
}): Promise<SellerResponse> {
  try {
    const res = await apiAxios.post('/feedbacks', { feedback: data })

    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}
async function getAllListings(token: string): Promise<ResListing[]> {
  try {
    const res = await apiAxios.get('/listings', {
      headers: {
        Authorization: token,
      },
    })
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}
async function getAllListingDetail(id: number | string, token: string): Promise<SingleListingRes> {
  try {
    const res = await apiAxios.get(`/listings/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}
async function postBid(
  data: { listing_id: number; amount_currency: string; amount_cents: number },
  token: string,
): Promise<Bid> {
  try {
    const res = await apiAxios.post(
      `/bids`,
      { bid: data },
      {
        headers: {
          'Authorization': token as string,
        },
      },
    )
    return res.data?.bid
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function getYears() {
  try {
    const res = await apiAxios.get('/vehicle_specs/years')
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function getMakes(year: string) {
  try {
    const res = await apiAxios.get(`/vehicle_specs/years/${year}/makes`)
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function getModels(year: string, make: string) {
  try {
    const res = await apiAxios.get(`/vehicle_specs/years/${year}/makes/${make}/models`)
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function sendPhoneVerificationCode(
  phone_number: string,
  mobile_phoneable_id: number,
  mobile_phoneable_type: string,
  headers: any,
) {
  try {
    const params = {
      mobile_phone_number: {
        phone_number,
        mobile_phoneable_id,
        mobile_phoneable_type,
      },
    }

    const res = await apiAxios.post(
      '/mobile_phone_numbers',
      { ...params },
      {
        headers,
      },
    )
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function verifyPhoneVerificationCode(
  id: string,
  phone_number: string,
  verification_code: string,
  headers: any,
) {
  try {
    const params = {
      mobile_phone_number: {
        phone_number,
        verification_code,
      },
    }
    const res = await apiAxios.post(
      `/mobile_phone_numbers/${id}/verify`,
      { ...params },
      {
        headers,
      },
    )
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function enableBidding(id: string, headers: any) {
  try {
    const res = await apiAxios.post(
      `/listings/${id}/enable_bidding`,
      {},
      {
        headers,
      },
    )
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function getHighestBid(id: string, headers: any) {
  try {
    const res = await apiAxios.get(`/listings/${id}/highest_bid`, {
      headers,
    })
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

async function acceptBid(id: string, headers: any) {
  try {
    const res = await apiAxios.post(`/listings/${id}/accept_bid`, {}, { headers })
    return res.data
  } catch (error: any) {
    throw new Error(error?.response?.data)
  }
}

export const sellerApi = {
  sendVehicleDetail,
  acceptOfferApi,
  sendVerificationCode,
  verifyCode,
  addListing,
  feedBack,
  patchSeller,
  postSeller,
  patchListing,
  getAllListings,
  getAllListingDetail,
  postBid,
  getYears,
  getMakes,
  getModels,
  sendPhoneVerificationCode,
  verifyPhoneVerificationCode,
  enableBidding,
  getHighestBid,
  acceptBid,
}
