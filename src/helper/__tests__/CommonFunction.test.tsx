import { toast } from 'react-toastify'
import {
  WaitHandler,
  checkEmptyKeys,
  isYearLessThan12YearsAgo,
  getYearsArray,
} from '../CommonFunction'

// Mocking toast from react-toastify
jest.mock('react-toastify')

describe('Utility Functions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('WaitHandler should resolve after a given duration', async () => {
    const mockFn = jest.fn()
    WaitHandler(1).then(mockFn)

    expect(mockFn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1000)
    await Promise.resolve()
    expect(mockFn).toHaveBeenCalled()
  })

  it('checkEmptyKeys should detect empty keys and trigger a toast error', () => {
    const sampleObject = {
      name: 'John',
      age: '',
      city: 'New York',
    }

    const result = checkEmptyKeys(sampleObject)
    expect(result).toBe(false)
    expect(toast.error).toHaveBeenCalledWith('age is empty')
  })

  it('isYearLessThan12YearsAgo should check if a year is more than 12 years ago', () => {
    const currentYear = new Date().getFullYear()
    expect(isYearLessThan12YearsAgo(currentYear - 5)).toBe(false)
    expect(isYearLessThan12YearsAgo(currentYear - 13)).toBe(true)
  })

  it('getYearsArray should return an array starting from the current year to 1950', () => {
    const years = getYearsArray()
    expect(years[0]).toBe(new Date().getFullYear())
    expect(years[years.length - 1]).toBe(1950)
  })
})

beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})
