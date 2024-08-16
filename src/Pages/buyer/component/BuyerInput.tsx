import { Flex, Text } from '@chakra-ui/react'
import CustomInput from '../../../Components/CustomInput'

type Props = {
  heading: string
  placeholder?: string
  type: string
  onChange: (value: any) => void
  value: string | number
  disabled?: boolean
}
const BuyerInput = ({ disabled, heading, placeholder, type, onChange, value }: Props) => {
  const handleInputChange = (value: any) => {
    onChange(value)
  }

  return (
    <Flex
      flexDirection={'column'}
      gap='0.8rem'
      w={'100%'}
    >
      <Text
        color={'brand.900'}
        fontSize={'1.12rem'}
        fontWeight={'700'}
      >
        {heading}
      </Text>
      <CustomInput
        labelType=''
        disabled={disabled}
        value={value}
        type={type}
        onChange={handleInputChange}
        placeholder={placeholder || 'Enter'}
        width={{ base: '100%', lg: '100%' }}
        height='52px'
        pl='20px'
        fontSize='18px'
        sx={{ borderRadius: '0px' }}
      />
    </Flex>
  )
}
export default BuyerInput
