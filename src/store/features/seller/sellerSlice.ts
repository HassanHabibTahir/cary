import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import {
  acceptOfferHandler,
  addListing,
  getAllListingDetail,
  getAllListings,
  patchListing,
  patchSeller,
  postSeller,
  sendVehicleDetailAndGetOffer,
} from './sellerAction'
import {
  Attachment_Response,
  ListingResponse,
  MyBid,
  ResListing,
  SellerResponse,
  SingleListingRes,
} from '../../../types/listingApiTypes'
import { toast } from 'react-toastify'

export interface SellerState {
  enter_reg?: string
  enter_make?: string
  enter_mobile_phones?: string
  contact_name?: string
  street_line_1?: string
  street_line_2?: string
  email?: string
  state?: string
  zip_code?: string
  city?: string
  enter_model?: string
  enter_year?: number
  enter_vin?: string
  enter_zip?: string
  milage?: string
  postCode?: string
  code_confirmation?: boolean
  v5Doc?: boolean
  noticeConfirm?: boolean
  pickUp?: boolean
  enter_have_title?: boolean
  enter_vehicle_complete?: boolean
}
export interface OfferData {
  price: string
  deliverydays: string
}
export interface AcceptOffer {
  refrenceNumber: string
}

interface SellerDataState {
  seller: SellerState
  offer: OfferData
  acceptOfffer: AcceptOffer
  activeTab: number
  sellerDetail: SellerResponse
  currentListing: ListingResponse
  allListings: ResListing[]
  singleListing: SingleListingRes
  myBids: MyBid
  attachments: Attachment_Response[] | null
}
const initialState: SellerDataState = {
  currentListing: {
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
  },
  seller: {
    enter_reg: '',
    enter_make: '',
    contact_name: '',
    street_line_1: '',
    street_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    email: '',
    code_confirmation: false,
    enter_mobile_phones: '',
    enter_model: '',
    enter_year: 0,
    enter_vin: '',
    enter_zip: '',
    milage: '',
    postCode: '',

    v5Doc: true,
    noticeConfirm: true,
    pickUp: true,
    enter_have_title: true,
    enter_vehicle_complete: true,
  },
  offer: {
    price: '',
    deliverydays: '',
  },
  acceptOfffer: {
    refrenceNumber: '',
  },
  activeTab: 0,
  sellerDetail: {
    tou_accepted_at: '',
    mobile_phone_number: '',
    mobile_phone_verification_code: 0,
    id: 0,
    contact_name: '',
    contact_email: '',
    created_at: '',
    seller_token: '',
    updated_at: '',
  },
  allListings: [],
  singleListing: {
    listing: {
      id: 0,
      year: 0,
      zip: '',
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
    bids: [],
  },
  myBids: {},
  attachments: null,
}

export const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearSellerPeristData: (state) => {
      state.seller = initialState.seller
      state.offer = initialState.offer
      state.acceptOfffer = initialState.acceptOfffer
      state.sellerDetail = initialState.sellerDetail
      state.currentListing = initialState.currentListing
      state.allListings = initialState.allListings
      state.singleListing = initialState.singleListing
      state.myBids = initialState.myBids
      state.attachments = initialState.attachments
    },
    updateCurrentListing: (state, action: PayloadAction<ListingResponse>) => {
      state.currentListing = action.payload
    },
    updateMyBidList: (state, action: PayloadAction<{ id: number; bid: number }>) => {
      const { id, bid } = action.payload
      state.myBids[id] = { bid }
    },
    updatedSellerData: (state, action: PayloadAction<SellerState>) => {
      Object.assign(state.seller, action.payload)
    },
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload
    },
    updateAttachment: (state, action: PayloadAction<Attachment_Response>) => {
      const list = current(state)?.attachments ?? []
      const isExist = list?.find((item) => item?.detail === action.payload?.detail)
      if (!isExist) {
        state.attachments = [action.payload, ...list]
        return
      }
      const updateAttachment = list?.map((item) => {
        if (item?.detail === action?.payload?.detail) {
          return action.payload
        }
        return item
      })
      state.attachments = updateAttachment
    },
    removeAttachment: (state, action: PayloadAction<Attachment_Response>) => {
      const list = current(state)?.attachments ?? []
      const updateAttachment = list?.filter((item) => item?.detail !== action?.payload?.detail)
      state.attachments = updateAttachment
    },
    removeAllAttachments: (state) => {
      state.attachments = null
    },
    setSingleListing: (state, action: PayloadAction<ResListing>) => {
      state.singleListing = {
        listing: action.payload,
        bids: [],
        currentBid: 23,
      }
    },
    setInitialState: (state) => {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendVehicleDetailAndGetOffer.fulfilled, (state, action) => {
      state.offer = action.payload
    })
    builder.addCase(sendVehicleDetailAndGetOffer.rejected, () => {
    })
    builder.addCase(acceptOfferHandler.fulfilled, (state, action) => {
      state.acceptOfffer = action.payload
    })
    builder.addCase(postSeller.fulfilled, (state, action) => {
      state.sellerDetail = action.payload
    })
    builder.addCase(patchSeller.fulfilled, (state, action) => {
      state.sellerDetail = action.payload
    })
    builder.addCase(addListing.fulfilled, (state, action) => {
      state.currentListing = action.payload
    })
    builder.addCase(patchListing.fulfilled, (state, action) => {
      state.currentListing = action.payload
    })
    builder.addCase(getAllListings.fulfilled, (state, action) => {
      state.allListings = action.payload
    })
    builder.addCase(getAllListingDetail.fulfilled, (state, action) => {
      const bids = action.payload.bids
      state.singleListing = {
        ...action.payload,
        currentBid: bids[bids.length - 1].amount_cents,
      }
    })
    builder.addCase(getAllListings.rejected, (_, action) => {
      toast.error(action.payload as string)
    })
  },
})
export const { clearSellerPeristData } = sellerSlice.actions

// Action creators are generated for each case reducer function
export const {
  updatedSellerData,
  setActiveTab,
  setSingleListing,
  setInitialState,
  updateMyBidList,
  updateAttachment,
  removeAttachment,
  updateCurrentListing,
  removeAllAttachments,
} = sellerSlice.actions

export default sellerSlice.reducer
