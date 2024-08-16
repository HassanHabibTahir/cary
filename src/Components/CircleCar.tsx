'use client'
import { AiFillCar } from 'react-icons/ai'

import { Box } from '@chakra-ui/react'

export default function CircleCar() {
  return (
    <Box
      height={150}
      width={150}
      borderRadius={'50%'}
      bg={'#4AE29A'}
      p={2}
      zIndex={1}
      mb={'-60px'}
      data-testid='outer-circle'
    >
      <Box
        height={'100%'}
        width={'100%'}
        borderRadius={'50%'}
        bg={'white'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        data-testid='inner-circle'
      >
        <Box mt={-5}>
          <AiFillCar
            data-testid='car-icon'
            size={50}
          />
        </Box>
      </Box>
    </Box>
  )
}
