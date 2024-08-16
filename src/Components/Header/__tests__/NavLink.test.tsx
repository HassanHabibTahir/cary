import { render, screen } from '@testing-library/react'
import NavLink from '../NavLink'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}))

describe('NavLink Component', () => {
  it('renders without crashing', () => {
    const mockProps = {
      name: 'testName',
      href: '/testHref',
    }

    render(<NavLink {...mockProps} />)

    const linkElement = screen.getByText(/testName/i)
    expect(linkElement).toBeInTheDocument()
  })

  it('displays the correct name prop as text', () => {
    const mockProps = {
      name: 'testName',
      href: '/testHref',
    }

    render(<NavLink {...mockProps} />)

    expect(screen.getByText(/testName/i)).toBeInTheDocument()
  })

  it('sets the href attribute correctly', () => {
    const mockProps = {
      name: 'testName',
      href: '/testHref',
    }

    render(<NavLink {...mockProps} />)

    const linkElement = screen.getByText(/testName/i).closest('a')
    expect(linkElement).toHaveAttribute('href', '/testHref')
  })
})
