import { render, fireEvent } from '@testing-library/react'

// import { TextProps } from '../Text'

import SelectFile from '../SelectFile'

// Mock the Text component
// jest.mock('../Text', () => {
//   const MockedText: React.FC<TextProps> = (props) => (
//     <div data-testid={`text-${props.type}`}>{props.type}</div>
//   )
//   return {
//     __esModule: true,
//     default: MockedText,
//   }
// })

describe('SelectFile Component', () => {
  it('should render without crashing', () => {
    const mockHandleFileChange = jest.fn()
    const { container } = render(
      <SelectFile
        labelType='sampleKey'
        handleFileChange={mockHandleFileChange}
      />,
    )
    expect(container).toBeInTheDocument()
  })

  it('should display the correct label type', () => {
    const mockHandleFileChange = jest.fn()
    const { getByTestId } = render(
      <SelectFile
        labelType='sampleKey'
        handleFileChange={mockHandleFileChange}
      />,
    )
    expect(getByTestId('text-sampleKey')).toBeInTheDocument()
  })

  it('should call handleFileChange with the chosen file', () => {
    const mockHandleFileChange = jest.fn()
    const { getByPlaceholderText } = render(
      <SelectFile
        labelType='sampleKey'
        handleFileChange={mockHandleFileChange}
      />,
    )

    const fileInput = getByPlaceholderText('default placeholder')
    const file = new File(['sample'], 'sample.png', { type: 'image/png' })

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(mockHandleFileChange).toHaveBeenCalledWith(file)
  })
})
