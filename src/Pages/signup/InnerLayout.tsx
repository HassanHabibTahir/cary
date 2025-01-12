import {
  Box,
  Stack,
  Container,
  SimpleGrid,
  // useBreakpointValue,
  // IconProps,
  // Icon,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react'

// const Blur = (props: IconProps) => {
//   return (
//     <Icon
//       width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
//       zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
//       height='560px'
//       viewBox='0 0 528 560'
//       fill='none'
//       xmlns='http://www.w3.org/2000/svg'
//       {...props}
//     >
//       <circle
//         cx='71'
//         cy='61'
//         r='111'
//         fill='#F56565'
//       />
//       <circle
//         cx='244'
//         cy='106'
//         r='139'
//         fill='#ED64A6'
//       />
//       <circle
//         cy='291'
//         r='139'
//         fill='#ED64A6'
//       />
//       <circle
//         cx='80.5'
//         cy='189.5'
//         r='101.5'
//         fill='#ED8936'
//       />
//       <circle
//         cx='196.5'
//         cy='317.5'
//         r='101.5'
//         fill='#ECC94B'
//       />
//       <circle
//         cx='70.5'
//         cy='458.5'
//         r='101.5'
//         fill='#48BB78'
//       />
//       <circle
//         cx='426.5'
//         cy='-0.5'
//         r='101.5'
//         fill='#4299E1'
//       />
//     </Icon>
//   )
// }

const InnerLayout = ({ children }: any) => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box position={'relative'}>
      <Box
        height={'100%'}
        w={'100%'}
      >
        <Container
          as={SimpleGrid}
          maxW={'8xl'}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
          height={'auto'}
        >
          <Stack
            mt={10}
            display={isMobile ? 'none' : 'flex'}
          >
            <Image
              src={'/car.png'}
              width={'auto'}
            />
          </Stack>
          <Box>{children}</Box>
        </Container>
      </Box>
      {/* <Blur
        position={'absolute'}
        top={-10}
        left={-70}
        style={{ filter: 'blur(70px)' }}
      /> */}
    </Box>
  )
}
export default InnerLayout
