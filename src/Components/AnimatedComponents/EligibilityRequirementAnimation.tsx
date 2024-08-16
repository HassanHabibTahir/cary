import { Box } from '@chakra-ui/react'
import Lottie from 'lottie-react'
import timerAnimation from '../../../public/lottie/RequirementsAnimation.json'

export default function EligibilityRequirementAnimation() {
  return (
    <Box
      height={'100%'}
      width={'100%'}
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
  )
}
