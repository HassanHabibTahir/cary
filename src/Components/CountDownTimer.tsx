import React, { useState, useEffect } from 'react'
import Text from './Text'

interface CountdownProps {
  initialTime: number
  onEnd?: () => void
}

const CountDownTimer: React.FC<CountdownProps> = ({ initialTime, onEnd }) => {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId)
          if (onEnd) {
            onEnd()
          }
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [initialTime])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} min ${remainingSeconds?.toFixed(0)} sec`
  }

  return (
    <div>
      <Text
        size='50'
        weight='bold'
        color={'brand.900'}
      >
        {formatTime(time)}
      </Text>
    </div>
  )
}

export default CountDownTimer
