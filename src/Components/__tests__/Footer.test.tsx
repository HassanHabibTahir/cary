import { render } from '@testing-library/react'

// import { TextProps } from '../Text'


import Footer from '../../Components/Layouts/Footer'
// Mock the CircleCar and Text components to keep tests isolated
jest.mock('../CircleCar', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='circlecar-mock'>CircleCar</div>,
  }
})

// jest.mock('../Text', () => {
//   const MockedText: React.FC<TextProps> = (props) => (
//     <div data-testid={`text-${props.type}`}>{props.type}</div>
//   )
//   return {
//     __esModule: true,
//     default: MockedText,
//   }
// })

describe('Footer Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Footer />)
    expect(container).toBeInTheDocument()
  })

  it('should contain the CircleCar component', () => {
    const { getByTestId } = render(<Footer />)
    expect(getByTestId('circlecar-mock')).toBeInTheDocument()
  })

  it('should display the text "want_to_sell" using the Text component', () => {
    const { getByTestId } = render(<Footer />)
    expect(getByTestId('text-want_to_sell')).toBeInTheDocument()
  })

  it('should display the text "give_us_call" using the Text component', () => {
    const { getByTestId } = render(<Footer />)
    expect(getByTestId('text-give_us_call')).toBeInTheDocument()
  })
})
