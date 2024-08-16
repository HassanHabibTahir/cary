import { render, fireEvent } from '@testing-library/react'
import CustomRadio from '../CustomRadio'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}))

describe('CustomRadio Component', () => {
  it('should render without crashing', () => {
    const mockHandleRadioChange = jest.fn()
    const { container } = render(
      <CustomRadio
        field='testField'
        value=''
        handleRadioChange={mockHandleRadioChange}
      />,
    )
    expect(container).toBeInTheDocument()
  })

  it('should display the correct label type', () => {
    const mockHandleRadioChange = jest.fn()
    const { getByText } = render(
      <CustomRadio
        labelType='basic'
        field='testField'
        value=''
        handleRadioChange={mockHandleRadioChange}
      />,
    )
    expect(getByText('basic')).toBeInTheDocument() // Assumes Text component renders text based on the "type" prop.
  })

  it('should render radio buttons with correct labels', () => {
    const mockHandleRadioChange = jest.fn()
    const { getByText } = render(
      <CustomRadio
        field='testField'
        value=''
        handleRadioChange={mockHandleRadioChange}
      />,
    )
    expect(getByText('yes')).toBeInTheDocument()
    expect(getByText('no')).toBeInTheDocument()
  })

  it('should call handleRadioChange with the correct field and value when radio is clicked', () => {
    const mockHandleRadioChange = jest.fn()
    const { getByTestId } = render(
      <CustomRadio
        field='testField'
        value=''
        handleRadioChange={mockHandleRadioChange}
      />,
    )

    const yesRadio = getByTestId('yes-radio')

    fireEvent.click(yesRadio!) // The "!" is a non-null assertion in TypeScript
    expect(mockHandleRadioChange).toHaveBeenCalledWith('testField', '1')

    const noRadio = getByTestId('no-radio')
    fireEvent.click(noRadio!)
    expect(mockHandleRadioChange).toHaveBeenCalledWith('testField', '2')
  })
})
