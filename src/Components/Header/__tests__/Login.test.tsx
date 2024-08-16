import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import * as utils from '../../../store/features/user/userAction'
import { store } from '../../../store/store'
import Login from '../../../Pages/Login/Login'

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

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>,
    )
  })
  it('renders without crashing', () => {
    const loginForm = screen.getByTestId('login-form')
    expect(loginForm).toBeInTheDocument()
  })
  it('updates state when inputs change', () => {
    const buyerNoInput = screen.getByTestId('buyerNo-input')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')

    fireEvent.change(buyerNoInput, { target: { value: '123' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(buyerNoInput).toHaveValue('123')
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
  it('handles form submission successfully', async () => {
    const buyerNoInput = screen.getByTestId('buyerNo-input')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')

    fireEvent.change(buyerNoInput, { target: { value: '123' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    const loginButton = screen.getByTestId('login-button')

    const loginApiHandlerFn = jest.spyOn(utils, 'loginApiHandler')
    fireEvent.click(loginButton)
    expect(loginApiHandlerFn).toBeCalled()
  })
})
