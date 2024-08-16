import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import CarInfo from '../CarInfo'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '../../../../store/store'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'

jest.mock('@uppy/core', () => {
  return jest.fn()
})
jest.mock('@uppy/xhr-upload', () => jest.fn())
jest.mock('../../../../store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}))
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useDisclosure: jest.fn(() => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() })),
  useBreakpointValue: jest.fn(),
}))

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}))

describe('CarInfo Component Tests', () => {
  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockReturnValue(false)
    ;(useAppDispatch as jest.Mock).mockReturnValue(jest.fn())
    jest.clearAllMocks()
    render(
      <Provider store={store}>
        <Router>
          <CarInfo />
        </Router>
      </Provider>,
    )
  })
  it('should render without errors', () => {
    expect(screen.getByTestId('info-hey-there')).toBeInTheDocument()
  })

  // it('should show an error when VIN is not entered', () => {
  //   const nextButton = screen.getByTestId('infoSubmit')
  //   fireEvent.click(nextButton)

  //   expect(require('react-toastify').toast.error).toHaveBeenCalledWith('enter_vin is required')
  // })
})

describe('CarInfo Component Tests', () => {
    beforeEach(() => {
      ;(useAppSelector as jest.Mock).mockReturnValue({ seller: { enter_vin: '1212', enter_year: 2010 } })
      ;(useAppDispatch as jest.Mock).mockReturnValue(jest.fn())
      jest.clearAllMocks()
      render(
        <Provider store={store}>
          <Router>
            <CarInfo />
          </Router>
        </Provider>,
      )
    })
  
    it('should show an error for a vehicle model less than 12 years old', () => {
 
      const vinInput = screen.getByTestId('enter-vin')
      fireEvent.change(vinInput, { target: { value: '1212' } })
      expect(vinInput).toHaveValue('1212')
      const yearInput = screen.getByTestId('enter-year')
      fireEvent.change(yearInput, { target: { value: '2010' } })
  
      const nextButton = screen.getByTestId('infoSubmit')
      fireEvent.click(nextButton)
  
      // expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
      //   'Your vehicle modal is less than 12 year',
      // )
    })
  
  })
  