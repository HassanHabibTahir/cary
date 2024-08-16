import { Box, Center, Stack } from '@chakra-ui/react'
import { PiVanFill } from 'react-icons/pi'
import { GiTakeMyMoney } from 'react-icons/gi'
import { BsHeadset } from 'react-icons/bs'
import Text from '../../../Components/Text'

export default function Cards() {
  const cardsData = [
    {
      icon: <BsHeadset size={60} />,
      desc: 'ist_card',
    },
    {
      icon: <PiVanFill size={60} />,
      desc: 'second_card',
    },
    {
      icon: <GiTakeMyMoney size={60} />,
      desc: 'third_card',
    },
  ]
  return (
    <Box
      minH={400}
      bg={'#EFEFEF'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDir={{ base: 'column', md: 'row' }}
      gap={5}
      py={7}
      mt={30}
    >
      {cardsData?.map((item, index) => {
        return (
          <Center key={index}>
            <Box
              role={'group'}
              p={6}
              maxW={'330px'}
              w={'full'}
              rounded={'lg'}
              pos={'relative'}
              border={'1px solid #D6D6D6'}
            >
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                {item?.icon}
              </Box>
              <Stack
                pt={10}
                align={'center'}
              >
                <Text
                  type={item?.desc}
                  color={'gray.500'}
                  fontSize={'sm'}
                  textAlign={'center'}
                />
              </Stack>
            </Box>
          </Center>
        )
      })}
    </Box>
  )
}
