/* eslint-disable */

import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import Text from './Text'

interface CustomRadioProps {
  labelType?: string // Update the type to match the actual type used for labelType
  field: string // Update the type to match the actual type used for labelType
  value: string // Update the type to match the actual type used for value
  handleRadioChange: (field: string, value: '1' | '2') => void // Update the type for handleRadioChange
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  labelType,
  value,
  field,
  handleRadioChange,
}) => {
  return (
    <RadioGroup
      value={value}
      mt={2}
    >
      <Stack direction='row'>
        {labelType && (
          <Text
            type={labelType}
            size='17'
            w={300}
          />
        )}

        <Radio
          value='1'
          onChange={() => handleRadioChange(field, '1')}
          data-testid='yes-radio'
        >
          <Text
            type='yes'
            size='17'
          />
        </Radio>
        <Radio
          value='2'
          onChange={() => handleRadioChange(field, '2')}
          data-testid='no-radio'
        >
          <Text
            type='no'
            size='17'
          />
        </Radio>
      </Stack>
    </RadioGroup>
  )
}

export default CustomRadio
