import { Box } from '@chakra-ui/react'
import Text from '../Text'
import InvalidZipCodeAnimation from './InvalidZipCodeAnimation'

export default function NoZipCodeFound() {
  return (
    <>
      {/* TIMER ANIMATION */}
      <Box
        h={200}
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <InvalidZipCodeAnimation />
      </Box>
      <Box
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text
          type='zip_code_not_active'
          size='25'
          weight='bold'
          color={'brand.900'}
          textTransform={'uppercase'}
        />
      </Box>
      <Box
        h={150}
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text
          type='zip_code_appologies'
          size='15'
          textAlign={'center'}
          color={'gray'}
        />
      </Box>
    </>
  )
}
