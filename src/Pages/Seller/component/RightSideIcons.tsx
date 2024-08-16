import { Box, Flex } from '@chakra-ui/react'
import { GiTakeMyMoney } from 'react-icons/gi'
import { PiVanFill } from 'react-icons/pi'
import Text from '../../../Components/Text'

export default function RightSideIcons({ testId }: { testId?: string }) {
  return (
    <Box
      data-testId={testId}
      mt={7}
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        // ml={2}
      >
        <Flex
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <PiVanFill size={30} />
          <Text
          
            type='free_collection'
            size='13'
          />
        </Flex>
        {/* <Flex
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <BsClockHistory size={30} />
          <Text
            type='two_hour_payment'
            size='13'
          />
        </Flex> */}
      </Flex>

      <Flex
        width={50}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        mt={7}
        ml={4}
      >
        <GiTakeMyMoney size={30} />
        <Text
          type='no_fee'
          size='13'
        />
      </Flex>
    </Box>
  )
}
