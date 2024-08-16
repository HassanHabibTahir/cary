import Lottie from 'lottie-react'
import timerAnimation from '../../../public/lottie/BankAnimation.json'
import { useMediaQuery } from '@chakra-ui/react'

export default function MinimumBidBuyer() {
  const [isMobile] = useMediaQuery('(max-width: 480px)')
  return (
    <Lottie
      animationData={timerAnimation}
      style={{ width: '100%', height: isMobile ? 150 : 250 }}
    />
  )
}
