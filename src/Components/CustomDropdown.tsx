import React, { FocusEventHandler } from 'react'
import { Box, Select } from '@chakra-ui/react'
import Text from './Text'

export type OptionType = {
  label: string
  value: string
}

interface CustomDropdownProps {
  disabled?: boolean
  labelType: string
  value: string
  minW?: string
  options: OptionType[]
  width?: any
  onChange: (value: any) => void
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined
  placeholder: string
  [key: string]: any
  testId?: string
  borderRadius?: string | number
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  disabled,
  labelType,
  value,
  onChange,
  placeholder,
  minW = '200',
  width,
  testId,
  options,
  borderRadius,
}) => {
  return (
    <Box
      width={width}
      borderRadius={borderRadius ? borderRadius : 5}
    >
      <Text
        type={labelType}
        size='17'
      />
      {
        <Select
          data-testid={testId ? testId : placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          size='sm'
          mt={1}
          height={'40px'}
          minW={minW}
          borderRadius={borderRadius ? borderRadius : 20}
          disabled={options.length === 0 || disabled}
        >
          {options.map((option: OptionType, i: number) => (
            <option
              value={option.value}
              key={i}
            >
              {option.label}
            </option>
          ))}
        </Select>
      }
    </Box>
  )
}

export default CustomDropdown
