import { render, screen } from '@testing-library/react'
import Cards from '../Cards'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}))

describe('Cards Component', () => {
  it('renders the three cards with correct icons and descriptions', () => {
    render(<Cards />)

    const firstCardDescription = screen.queryByText(/ist_card/i)
    const secondCardDescription = screen.queryByText(/second_card/i)
    const thirdCardDescription = screen.queryByText(/third_card/i)

    expect(firstCardDescription).toBeInTheDocument()
    expect(secondCardDescription).toBeInTheDocument()
    expect(thirdCardDescription).toBeInTheDocument()
  })
})
