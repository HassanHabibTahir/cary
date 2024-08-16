// import { UserState } from './userSlice'
import { UploadAxios, apiAxios } from '../../../helper/apiConfig'
import { InterestProfileResponse, Interest_profile } from '../../../types/UserTypes'

async function loginApi(data: { email: string; password: string }) {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('email', data.email?.trim())
    bodyFormData.append('password', data.password)

    const res = await UploadAxios.post('/auth/login', bodyFormData)
    return res.data
  } catch (error) {
    console.log(error, 'Error')
    throw new Error('User not found! Please sign up')
  }
}
const getMyData = async (token: string) => {
  const res = await apiAxios.get('/me', {
    headers: {
      Authorization: token,
    },
  })
  return res.data?.user
}
const sellerCreate = async (data: { tou_accepted_at: string; token: string }) => {
  const res = await apiAxios.post(
    '/sellers',
    {
      seller: data,
    },
    {
      headers: {
        Authorization: data?.token,
      },
    },
  )
  return res.data
}
async function createBuyer(data: {
  tou_accepted_at: string
  token: string
  max_pickup_distance: number
  zip: string
}) {
  const res = await apiAxios.post(
    '/buyers',
    {
      buyer: data,
    },
    {
      headers: {
        Authorization: data?.token,
      },
    },
  )

  return res.data
}
async function signUpApi(data: {
  email: string
  password: string
  isBuyer: boolean
  buyerZipCode?: string
}) {
  const res = await apiAxios.post('/users', {
    user: {
      email: data?.email,
      password: data?.password,
      buyer_intent: data?.isBuyer ? true : false,
    },
  })

  if (res.data) {
    return await loginApi({ email: data?.email, password: data?.password })
  }
}

async function createUserBasedOnType(data: {
  token: string
  isBuyer: boolean
  max_pickup_distance?: number
  buyerZipCode?: string
}) {
  if (data?.isBuyer) {
    return await createBuyer({
      tou_accepted_at: new Date().toISOString(),
      token: data?.token,
      max_pickup_distance: data?.max_pickup_distance || 0,
      zip: data?.buyerZipCode || '',
    })
  } else {
    return await sellerCreate({
      tou_accepted_at: new Date().toISOString(),
      token: data?.token,
    })
  }
}

async function verifySignUpCode(data: {
  userId: string
  token: string
  code: string
  email: string
  password: string
}) {
  const res = await apiAxios.post(
    `/users/${data.userId}/verify_sign_up_code`,
    {
      sign_up_code: data?.code,
    },
    {
      headers: {
        Authorization: data?.token,
      },
    },
  )

  if (res.data) {
    if (res.data) {
      return await loginApi({ email: data?.email, password: data?.password })
    }
  }
}

async function createSellerUser(
  data: { email: string; password: string; isBuyer: boolean },
  token: string,
) {
  const res = await apiAxios.post(
    '/users',
    {
      user: { email: data?.email, password: data?.password },
    },
    {
      headers: {
        'seller-token': token,
      },
    },
  )
  // localStorage.setItem('SellerToken', res.data.seller_token)
  return res.data
  // return await loginApi({ email: data?.email, password: data?.password })
}
async function addInterestProfile(
  data: Interest_profile,
  token: string,
): Promise<Interest_profile> {
  const res = await apiAxios.post(
    '/interest_profiles',
    { interest_profile: data },
    {
      headers: {
        Authorization: token,
      },
    },
  )

  return res.data
}
async function updateInterestProfile(
  id: number,
  data: { year_start: number | string; year_end: number | string; make: string; model: string },
  token: string,
): Promise<InterestProfileResponse> {
  const res = await apiAxios.patch(
    `/interest_profiles/${id}`,
    { interest_profile: data },
    {
      headers: {
        Authorization: token,
      },
    },
  )
  return res.data
}

async function updateBuyerProfile(
  id: number,
  data: { first_name: string; last_name: string; buyer_number_us: number; buyer_number_uk: number },
  token: string,
): Promise<InterestProfileResponse> {
  const res = await apiAxios.patch(
    `/buyers/${id}`,
    { buyer: data },
    {
      headers: {
        Authorization: token,
      },
    },
  )
  return res.data
}

async function patchBuyerProfile(
  id: number,
  data: any,
  token: string,
): Promise<InterestProfileResponse> {
  const res = await apiAxios.patch(
    `/buyers/${id}`,
    { buyer: data },
    {
      headers: {
        Authorization: token,
      },
    },
  )
  return res.data
}

async function getBuyerById(id: number, token: string) {
  const res = await apiAxios.get(`/buyers/${id}`, {
    headers: {
      Authorization: token,
    },
  })
  return res.data
}

async function verifyZipCode(zipCode: string, token: string) {
  const res = await apiAxios.get(`/regions/verify_zip_code?zip_code=${zipCode}`, {
    headers: {
      Authorization: token,
    },
  })
  return res.data
}

async function getListingTypes(token: string) {
  try {
    const res = await apiAxios.get('/listing_types', {
      headers: {
        Authorization: token,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    return
  }
}

async function postBidPreference(data: any, token: string) {
  try {
    const res = await apiAxios.post('/bid_preferences', data, {
      headers: {
        Authorization: token,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    return
  }
}

async function patchBidPreference(id: any, data: any, token: string) {
  try {
    const res = await apiAxios.patch(`/bid_preferences/${id}`, data, {
      headers: {
        Authorization: token,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    return
  }
}

async function resendEmailVerificationCode(id: any, token: string) {
  try {
    const res = await apiAxios.post(
      `/users/${id}/resend_sign_up_code`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    )
    return res.data
  } catch (error) {
    console.log(error)
    return
  }
}
async function forgotPassword(data: any) {
  try {
    const res = await apiAxios.post('/users/forgot_password', data)
    return res.data
  } catch (error) {
    console.log(error,"error-->")
    return
  }
}


async function resetPassword(data: any) {
  try {
    const url = `/users/reset_password?email=${encodeURIComponent(data?.email)}&token=${encodeURIComponent(data?.token)}`;
    const res = await apiAxios.post(url, {password:data?.password })
    return res.data
  } catch (error) {
    console.log(error,"error-->")
    return
  }
}


async function getUserById(id: string | number, token: string) {
  try {
    const res = await apiAxios.get(`/users/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    return
  }
}

async function updateUser(id: string | number, data: any, token: string) {
  try {
    const res = await apiAxios.patch(`/users/${id}`, data, {
      headers: {
        Authorization: token,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    return
  }
}

export const userApi = {
  loginApi,
  signUpApi,
  forgotPassword,
  resetPassword,
  verifySignUpCode,
  addInterestProfile,
  updateUser,
  createSellerUser,
  updateInterestProfile,
  getMyData,
  getUserById,
  updateBuyerProfile,
  patchBuyerProfile,
  createUserBasedOnType,
  verifyZipCode,
  getBuyerById,
  getListingTypes,
  postBidPreference,
  patchBidPreference,
  resendEmailVerificationCode,
}
