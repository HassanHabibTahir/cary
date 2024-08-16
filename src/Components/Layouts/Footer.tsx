import { Flex } from '@chakra-ui/react'
import Text from '../Text'

export const Footer = () => {
  return (
    <Flex
      bg='white'
      width='100%'
      justifyContent='center'
      alignItems='center'
      direction='column'
      boxShadow='0 -1px 6px -1px rgba(0, 0, 0, 0.1)'
      padding={4}
    >
      {/* <HStack
        spacing={8}
        mb={8}
      >
        <Link
          to={'/terms-of-use'}
          color='gray.400'
        >
          Terms of Use
        </Link>
        <Link
          to={'/privacy-policy'}
          color='gray.400'
        >
          Privacy
        </Link>
      </HStack> */}
      <Flex
        width='100%'
        justifyContent='center'
        wrap='wrap'
      >
        <Text
          width='50%'
          textAlign='center'
          color='gray.600'
          fontSize='sm'
        >
          <Text as={'span'} textAlign='center' color='gray.600' fontSize='sm' type='copyright' mr={1} />
           &copy; {new Date().getFullYear()} Copart Inc. {" "}
          <Text
            as={'span'}
            textAlign='center'
            color='gray.600'
            fontSize='sm'
            type='all_right_reserved'
          />
        </Text>
      </Flex>
    </Flex>
  )
}
