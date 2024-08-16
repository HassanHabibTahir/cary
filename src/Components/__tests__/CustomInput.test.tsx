import { render, fireEvent } from '@testing-library/react'
import CustomInput from '../CustomInput'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}))

describe('CustomInput Component', () => {
  it('should render without crashing', () => {
    const mockOnChange = jest.fn()
    const { container } = render(
      <CustomInput
        labelType='basic'
        value=''
        onChange={mockOnChange}
        placeholder='Enter something'
      />,
    )
    expect(container).toBeInTheDocument()
  })

  it('should display the correct label type', () => {
    const mockOnChange = jest.fn()
    const { getByText } = render(
      <CustomInput
        labelType='basic'
        value=''
        onChange={mockOnChange}
        placeholder='Enter something'
      />,
    )
    expect(getByText('basic')).toBeInTheDocument()
  })

  it('should call onChange with the input value', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <CustomInput
        labelType='basic'
        value=''
        onChange={mockOnChange}
        placeholder='Enter something'
      />,
    )
    const input = getByTestId('Enter something')
    fireEvent.change(input, { target: { value: 'test value' } })
    expect(mockOnChange).toHaveBeenCalledWith('test value')
  })

  it('should display the correct placeholder', () => {
    const mockOnChange = jest.fn()
    const { getByPlaceholderText } = render(
      <CustomInput
        labelType='basic'
        value=''
        onChange={mockOnChange}
        placeholder='Enter something'
      />,
    )
    expect(getByPlaceholderText('Enter something')).toBeInTheDocument()
  })
})
