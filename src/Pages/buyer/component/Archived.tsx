import { Flex, Stack } from '@chakra-ui/react'
import CarCard from '../CarCard'

const Archived = () => {
  return (
    <Stack spacing={'1.5rem'}>
      <Flex
        wrap={'wrap'}
        gap={'1.5rem'}
        justifyContent={'space-evenly'}
      >
        <CarCard
          title='Range Rover'
          price={45000}
          src='/carCard.png'
          year={2000}
          archived
        />
        <CarCard
          title='Range Rover'
          price={45000}
          src='/carCard.png'
          year={2000}
          archived
        />
        <CarCard
          title='Range Rover'
          price={45000}
          src='/carCard.png'
          year={2000}
          archived
        />
      </Flex>
      <Flex
        wrap={'wrap'}
        gap={'1.5rem'}
        justifyContent={'space-evenly'}
      >
        <CarCard
          title='Range Rover'
          price={45000}
          src='/carCard.png'
          year={2000}
          archived
        />
        <CarCard
          title='Range Rover'
          price={45000}
          src='/carCard.png'
          year={2000}
          archived
        />
        <CarCard
          title='Range Rover'
          price={45000}
          src='/carCard.png'
          year={2000}
          archived
        />
      </Flex>
    </Stack>
  )
}
export default Archived
