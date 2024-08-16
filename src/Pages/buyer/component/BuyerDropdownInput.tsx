import { Flex, Select } from '@chakra-ui/react'
import Text from '../../../Components/Text'

type OptionType = {
  label: string
  value: string
}

type Props = {
  heading: string
  placeholder?: string
  onChange: (value: any) => void
  value: string | number
  disabled?: boolean
  options: OptionType[]
}
const BuyerDropdownInput = ({
  disabled,
  heading,
  placeholder,
  options,
  onChange,
  value,
}: Props) => {
  return (
    <Flex
      flexDirection={'column'}
      gap='0.8rem'
      w={'100%'}
    >
      <Text
        color={'brand.900'}
        fontSize={'1.12rem'}
        fontWeight={'600'}
        type={heading}
      />
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size='lg'
        mt={1}
        disabled={options.length === 0 || disabled}
        required
        width={{ base: '100%', lg: '100%' }}
        height='52px'
        fontSize='18px'
        sx={{ borderRadius: '0px' }}
      >
        {options.map((option: OptionType) => (
          <option
            value={option.value}
            key={option.label}
          >
            {option.label}
          </option>
        ))}
      </Select>
    </Flex>
  )
}
export default BuyerDropdownInput
