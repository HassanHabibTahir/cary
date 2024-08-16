import { render, screen } from '@testing-library/react'
import BuyerLanding from '../BuyerProfile'

describe('BuyerLanding Component', () => {
  it('renders the comingSoon image', () => {
    render(<BuyerLanding />)

    const imageElement = screen.getByRole('img')
    expect(imageElement).toBeInTheDocument()
    expect(imageElement).toHaveAttribute('src', '/comingSoon.png')
  })
})
