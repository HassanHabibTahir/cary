import Lottie from 'lottie-react'
import timerAnimation from '../../../public/lottie/ProfileAnimation.json'
import { useMediaQuery } from '@chakra-ui/react'

export default function ProfileAnimation() {
  const [isMobile] = useMediaQuery('(max-width: 480px)')

  return (
    <Lottie
      animationData={timerAnimation}
      style={{ width: '100%', height: isMobile ? 150 : 250 }}
    />
  )
}
