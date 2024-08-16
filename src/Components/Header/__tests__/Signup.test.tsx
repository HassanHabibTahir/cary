import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import Signup from '../../../Pages/signup/Signup'
import { store } from '../../../store/store'
import * as utils from '../../../store/features/user/userAction'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))
jest.mock('../../../store/hooks', () => ({
  useAppDispatch: jest.fn(),
}))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}))

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useDisclosure: jest.fn(() => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() })),
  useBreakpointValue: jest.fn(),
}))
describe('Signup Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(
      <Provider store={store}>
        <Router>
          <Signup />
        </Router>
      </Provider>,
    )
  })

  it('renders without crashing', () => {
    const signUpHeading = screen.getByTestId('signup-heading')
    expect(signUpHeading).toBeInTheDocument()
  })

  it('updates state when inputs change', () => {
    const nameInput = screen.getByTestId('name-input')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const selectInput = screen.getByTestId('select-input')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.change(selectInput, { target: { value: '1' } })

    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('password123')
    expect(selectInput).toHaveValue('1')
  })

  it('handles form submission successfully', async () => {
    const nameInput = screen.getByTestId('name-input')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const selectInput = screen.getByTestId('select-input')
    const signUpButton = screen.getByTestId('signup-button')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.change(selectInput, { target: { value: '1' } })
    const signupApiHandlerFn = jest.spyOn(utils, 'signupApiHandler')
    fireEvent.click(signUpButton)
    expect(signupApiHandlerFn).toBeCalled()
  })
})
