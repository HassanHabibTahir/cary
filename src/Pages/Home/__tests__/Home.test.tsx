import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '../../../store/hooks'

import Home from '../Home'

// Mock the hooks
jest.mock('../../../store/hooks')

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useBreakpointValue: jest.fn(() => false),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}))

describe('Home Component', () => {
  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockReturnValue(false)
    ;(useAppDispatch as jest.Mock).mockReturnValue(jest.fn())
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
  })

  it('renders form fields and button correctly', () => {
    expect(screen.getByPlaceholderText(/enter_reg/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/milage/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/post_code/i)).toBeInTheDocument()
    expect(screen.getByTestId('get_a_quote')).toBeInTheDocument()
  })
  it('updates the form input values on change', () => {
    fireEvent.change(screen.getByPlaceholderText(/enter_reg/i), { target: { value: 'AB1234' } })
    fireEvent.change(screen.getByPlaceholderText(/milage/i), { target: { value: '5000' } })
    fireEvent.change(screen.getByPlaceholderText(/post_code/i), { target: { value: '12345' } })

    expect(screen.getByPlaceholderText(/enter_reg/i).getAttribute('value')).toBe('AB1234')
    expect(screen.getByPlaceholderText(/milage/i).getAttribute('value')).toBe('5000')
    expect(screen.getByPlaceholderText(/post_code/i).getAttribute('value')).toBe('12345')
  })
})
