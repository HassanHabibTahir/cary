import { fireEvent, render, screen } from '@testing-library/react'
import Seller from '../Seller'

jest.mock('@uppy/core', () => {
  return jest.fn()
})
jest.mock('@uppy/xhr-upload', () => jest.fn())
jest.mock('../../../store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}))
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useDisclosure: jest.fn(() => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() })),
  useBreakpointValue: jest.fn(),
}))
describe('Seller component', () => {
  it('renders without crashing', () => {
    render(<Seller />)
    expect(screen.getByTestId('seller-page')).toBeDefined()
  })

  it('switches between "About My Car" and "Need Help" tabs', () => {
    render(<Seller />)
    const aboutMyCarButton = screen.getByTestId('about-my-car')
    const needHelpButton = screen.getByTestId('seller-need-help')

    expect(needHelpButton).toHaveStyle('background-color: #0054DA')
    expect(aboutMyCarButton).not.toHaveStyle('background-color: #0054DA')

    fireEvent.click(needHelpButton)

    expect(aboutMyCarButton).not.toHaveStyle('background-color: #0054DA')
    expect(needHelpButton).toHaveStyle('background-color: #0054DA')
  })

  it('displays car information when "About My Car" tab is active', () => {
    render(<Seller />)
    const aboutMyCarButton = screen.getByTestId('about-my-car')

    fireEvent.click(aboutMyCarButton)

    expect(screen.getByTestId('seller-make')).toBeInTheDocument()
    expect(screen.getByTestId('seller-model')).toBeInTheDocument()
  })

  it('displays help information when "Need Help" tab is active', () => {
    render(<Seller />)
    const needHelpButton = screen.getByTestId('seller-need-help')

    fireEvent.click(needHelpButton)

    expect(screen.getByTestId('seller-title')).toBeInTheDocument()
    expect(screen.getByTestId('seller-desc')).toBeInTheDocument()
  })

  it('renders the correct text when "About My Car" tab is active', () => {
    render(<Seller />)
    const aboutMyCarButton = screen.getByTestId('about-my-car')

    fireEvent.click(aboutMyCarButton)

    expect(screen.getByTestId('seller-model')).toBeInTheDocument()
  })
})
