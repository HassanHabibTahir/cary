import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Sellerlist from '../../../Pages/Seller/Sellerlist'
import * as Routertils from 'react-router-dom'
import * as router from 'react-router'

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useBreakpointValue: jest.fn(),
}))

describe('Sellerlist Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => jest.fn())

    render(
      <Router>
        <Sellerlist />
      </Router>,
    )
  })

  it('renders without crashing', () => {
    const sellerList = screen.getByTestId('seller-list')
    expect(sellerList).toBeInTheDocument()
  })

  it('displays "Become a Buyer" button', () => {
    const becomeBuyerButton = screen.getByTestId('become-a-buyer-button')
    expect(becomeBuyerButton).toBeInTheDocument()
  })

  it('displays "Add Vehicle" button', () => {
    const addVehicleButton = screen.getByTestId('add-vehicle-button')
    expect(addVehicleButton).toBeInTheDocument()
  })

  it('navigates to "/buyer" when "Become a Buyer" button is clicked', () => {
    const becomeBuyerButton = screen.getByTestId('become-a-buyer-button')
    fireEvent.click(becomeBuyerButton)
    const navigateFn = jest.spyOn(Routertils, 'useNavigate')
    expect(navigateFn).toHaveBeenCalled()
  })

  it('navigates to "/seller/add" when "Add Vehicle" button is clicked', () => {
    const addVehicleButton = screen.getByTestId('add-vehicle-button')
    fireEvent.click(addVehicleButton)
    const navigateFn = jest.spyOn(Routertils, 'useNavigate')
    expect(navigateFn).toHaveBeenCalled()
  })

  it('displays a list of seller items', () => {
    const sellerItems = screen.getAllByTestId('seller-item')
    expect(sellerItems.length).toBe(3)
  })
})
