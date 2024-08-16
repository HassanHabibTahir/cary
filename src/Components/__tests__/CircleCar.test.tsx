import { render } from '@testing-library/react'
import CircleCar from '../CircleCar'

describe('CircleCar Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<CircleCar />)
    expect(container).toBeInTheDocument()
  })

  it('should render a circle with the specified styles', () => {
    const { getByTestId } = render(<CircleCar />)
    const outerCircle = getByTestId('outer-circle')
    expect(outerCircle).toHaveStyle({
      height: '150px',
      width: '150px',
      borderRadius: '50%',
      background: '#4AE29A',
    })
  })

  it('should render an inner white circle', () => {
    const { getByTestId } = render(<CircleCar />)
    const innerCircle = getByTestId('inner-circle')
    expect(innerCircle).toHaveStyle({
      height: '100%',
      width: '100%',
      borderRadius: '50%',
      background: 'white',
    })
  })

  it('should contain a car icon', () => {
    const { getByTestId } = render(<CircleCar />)
    const carIcon = getByTestId('car-icon')
    expect(carIcon).toBeInTheDocument()
  })
})
