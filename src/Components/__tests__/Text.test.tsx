import { render } from '@testing-library/react'
import Text from '../Text'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}))

describe('Text Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Text />)
    expect(container).toBeInTheDocument()
  })

  it('should display the translation for the given type', () => {
    const { getByText } = render(<Text type='sampleKey' />)
    expect(getByText('sampleKey')).toBeInTheDocument()
  })

  it('should display children if no type is provided', () => {
    const { getByText } = render(<Text>Sample Child</Text>)
    expect(getByText('Sample Child')).toBeInTheDocument()
  })

  it('should have correct default fontSize and fontWeight values', () => {
    const { getByText } = render(<Text type='sampleKey' />)
    const textElement = getByText('sampleKey')
    expect(textElement).toHaveStyle({
      fontSize: '20px',
      fontWeight: '500',
    })
  })

  it('should override fontSize and fontWeight if provided', () => {
    const { getByText } = render(
      <Text
        type='sampleKey'
        size='24'
        weight='700'
      />,
    )
    const textElement = getByText('sampleKey')
    expect(textElement).toHaveStyle({
      fontSize: '24px',
      fontWeight: '700',
    })
  })
})
