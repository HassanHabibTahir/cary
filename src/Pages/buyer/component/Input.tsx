import { Flex, Text, Input } from '@chakra-ui/react'
import { ChangeEvent } from 'react'

type Props = {
  text: string
  type: string
  placeholder: string
  disabled?: boolean
  value?: any
  onChange: (value: any) => void
}

const InputField = ({ text, type, placeholder, value, onChange, disabled, ...rest }: Props) => {
  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }
  return (
    <Flex
      flexDirection={'column'}
      gap='0.8rem'
    >
      <Text
        color='#1A202C'
        fontSize={'0.875rem'}
        fontWeight={'600'}
      >
        {text}
      </Text>
      <Input
        borderRadius={'0.52rem'}
        bgColor={'#F6F7F9'}
        pl='1.4rem'
        width={{ base: '100%', md: '100%', xl: '320px' }}
        type={type}
        placeholder={placeholder}
        _placeholder={{ fontSize: '0.81rem', color: 'black', fontWeight: '500' }}
        value={value}
        onChange={onChangeText}
        {...rest}
        disabled={disabled}
      />
    </Flex>
  )
}

export default InputField
