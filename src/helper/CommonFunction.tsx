import { toast } from 'react-toastify'

export function WaitHandler(durationSeconds: number) {
  const durationMilliseconds = durationSeconds * 1000
  return new Promise((resolve) => {
    setTimeout(resolve, durationMilliseconds)
  })
}

export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

export function isValidCopartEmail(email: string) {
  return email.includes('@copart.com')
}

export function checkIfStringContainsSpaces(str: string): boolean {
  return /\s/.test(str)
}

export function checkEmptyKeys(obj: any): boolean {
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (typeof value === 'string' && value.trim() === '') {
        toast.error(`${key} is empty`)
        return false
      }
    }
  }
  return true
}
export function isYearLessThan12YearsAgo(year: number): boolean {
  const currentYear: number = new Date().getFullYear()
  const twelveYearsAgo: number = currentYear - 12

  return year < twelveYearsAgo
}

export function getYearsArray(): number[] {
  const currentYear: number = new Date().getFullYear()
  const startYear: number = 1950
  const yearsArray: number[] = []

  for (let year: number = currentYear; year >= startYear; year--) {
    yearsArray.push(year)
  }

  return yearsArray
}

export const getUserDetails = (user: any) => {
  if (!user) return null
  const buyer = user?.meData?.buyer?.buyer_info || null
  const seller = user?.meData?.seller?.seller_info || null
  if (buyer) return { ...buyer, isBuyer: true, isSeller: false }
  if (seller) return { ...seller, isBuyer: false, isSeller: true }
  return null
}

export const turncateString = (str: string, length: number) => {
  if (str.length > length) {
    return `${str.substring(0, length)}...`
  }
  return str
}

export const isArray = (value: any) => {
  return Array.isArray(value)
}

export const unWrapApiError = (error: any) => {
  const errors = error?.response?.data?.errors || ''
  if (isArray(errors)) {
    errors.forEach((element: string) => {
      toast.error(element)
    })
  } else {
    toast.error(errors)
  }
}

export const blobToFileList = (blob: Blob, fileName: string): FileList => {
  const file = new File([blob], fileName, { type: blob.type })

  const fileList: FileList = {
    0: file,
    length: 1,
    item(index: number): File | null {
      return index === 0 ? file : null
    },
    [Symbol.iterator]: function* () {
      yield file
    },
  }

  return fileList
}

export const calculateSecondsRemaining = (timestampStr: string) => {
  // Convert the timestamp string to a Date object
  const biddingClosingTime: Date = new Date(timestampStr)

  // Get the current time
  const currentTime: Date = new Date()

  // Calculate the time difference in milliseconds
  const timeDifference: number = biddingClosingTime.getTime() - currentTime.getTime()

  // Convert milliseconds to seconds
  const secondsRemaining: number = timeDifference / 1000

  return secondsRemaining
}

export const getInterestProfile = (mydata: any) => {
  try {
    return mydata?.buyer.interest_profiles[0]
  } catch (error) {
    return null
  }
}

export const checkIfInterestProfileCompleted = (isBuyer: boolean, userDetails: any, interestProfile: any) => {
  if (isBuyer) {
    return (
      (userDetails?.meData?.interest_profile_complete || userDetails?.userLoginInfo?.interest_profile_complete) &&
      (interestProfile && interestProfile?.mobile_phone_number)
    )
  }

  return false
}

export const senitizePreferredLanguage = (lang: string) => {
  if (lang === 'es') {
    return 'sp'
  }
  return 'en'
}

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
