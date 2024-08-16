import React, { ChangeEvent, FocusEventHandler } from 'react'
import { Input as ChakraInput, Box } from '@chakra-ui/react'
import Text from './Text'

interface CustomInputProps {
  labelType: string
  value: string | number
  minW?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  width?: any
  onChange: (value: any) => void
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined
  placeholder: string
  // Define any additional props here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  testId?: string
}

const CustomInput: React.FC<CustomInputProps> = ({
  labelType,
  value,
  onChange,
  onBlur,
  placeholder,
  minW = '200',
  width,
  testId,
  ...rest
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <Box
      width={width}
      borderRadius={5}
    >
      <Text
        type={labelType}
        size='17'
      />
      <ChakraInput
        data-testid={testId ? testId : placeholder}
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={placeholder}
        size='sm'
        mt={1}
        height={'40px'}
        minW={minW}
        {...rest} // Spread the additional props here
        borderRadius={20}
      />
    </Box>
  )
}

export default CustomInput
