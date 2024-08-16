import { Text as ChakraText, TextProps as ChakraTextProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export interface TextProps extends ChakraTextProps {
  type?: string
  size?: string
  weight?: string
}

export default function Text({
  type,
  children,
  size = '20',
  weight = '500',
  ...rest
}: TextProps): JSX.Element {
  const { t } = useTranslation()
  return (
    <ChakraText
      fontSize={size}
      fontWeight={weight}
      {...rest}
    >
      {type ? t(type) : children}
    </ChakraText>
  )
}
