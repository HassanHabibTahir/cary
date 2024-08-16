import { Box } from '@chakra-ui/react'
import Lottie from 'lottie-react'
import timerAnimation from '../../../public/lottie/TimerAnimation.json'

export default function BiddingTimerAnimation() {
  return (
    <Box
      height={150}
      width={150}
      borderRadius={'50%'}
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
        <Lottie
          animationData={timerAnimation}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
    </Box>
  )
}
