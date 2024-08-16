import { Box } from '@chakra-ui/react'
import Lottie from 'lottie-react'
import timerAnimation from '../../../public/lottie/SingUpAnimation.json'

export default function SignUpAnimation() {
  return (
    <Box
      height={'100%'}
      width={'100%'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      data-testid='inner-circle'
      bg={'#0054DA'}
    >
      <Lottie
        animationData={timerAnimation}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  )
}
