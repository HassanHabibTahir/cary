import '@testing-library/jest-dom/extend-expect'; // For more assertion options
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { store } from '../../../../store/store'
import WhyChoose from '../WhyChoose'
jest.mock('../../../../store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}))
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useDisclosure: jest.fn(() => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() })),
  useBreakpointValue: jest.fn(),
}))
describe('WhyChoose component', () => {
  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockReturnValue({ activeTab: 1 })
    ;(useAppDispatch as jest.Mock).mockReturnValue(jest.fn())
    jest.clearAllMocks()
    render(
      <Provider store={store}>
        <Router>
          <WhyChoose />
        </Router>
      </Provider>,
    )
  })
  it('renders correctly', () => {
    expect(screen.getByTestId('why-choose')).toBeInTheDocument()
  })

  it('displays the correct text content', () => {
    
    expect(screen.getByText('why_choose_heading')).toBeInTheDocument();
    expect(screen.getByText('why_choose_description')).toBeInTheDocument();
  });
  
  it('calls onNextClick when "Next" button is clicked', () => {
    const nextButton = screen.getByTestId('why-choose-next')
    fireEvent.click(nextButton)

    const dispatchMock = useAppDispatch()
    expect(dispatchMock).toBeCalledWith({ payload: 2, type: 'seller/setActiveTab' })
  })
  it('calls onBackClick when "Back" button is clicked', () => {
    const backButton = screen.getByTestId('why-choose-back-btn') 
    fireEvent.click(backButton)

    const dispatchMock = useAppDispatch()
    expect(dispatchMock).toBeCalledWith({ payload: 0, type: 'seller/setActiveTab' })
  })
})
