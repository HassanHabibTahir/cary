import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Car from '../../../Components/car'
import { logout } from '../../../store/features/user/userSlice'
import { clearSellerPeristData } from '../../../store/features/seller/sellerSlice'

const Sidebar = () => {
  const dispatch = useDispatch()
  return (
    <Box
      width={{ md: '24rem', lg: '18rem' }}
      background='white'
      borderRight='1px solid #F3F5F7;'
      // height='86vh'
      pt='2rem'
      pl='2rem'
      display={{ base: 'none', md: 'block' }}
      // flexGrow='1'
    >
      <Flex
        direction='column'
        gap={7}
        height='100%'
        justifyContent='space-between'
      >
        <Flex
          direction={'column'}
          gap='2rem'
        >
          <Text
            as='p'
            color='rgba(148, 167, 203, 0.40);'
            fontSize='0.75rem'
            fontWeight='700'
          >
            M A I N M E N U
          </Text>
          <NavLink
            to='listings'
            end
            className={({ isActive }) => (isActive ? 'NavLinkActive' : 'NavLinkSvg')}
          >
            <Flex
              gap='2'
              my={8}
              bgColor='inherit'
              margin={'inherit'}
              color={'inherit'}
              padding={'inherit'}
              borderRadius={'inherit'}
              alignItems={'start'}
            >
              <Car inherit={'inherit'} />
              <Text
                color={'inherit'}
                fontSize={'1rem'}
              >
                Open listing
              </Text>
            </Flex>
          </NavLink>
          {/* <NavLink
            to='archive'
          >
            <Flex
              gap='2'
              my={8}
              bgColor='inherit'
              margin={'inherit'}
              color={'inherit'}
              padding={'inherit'}
              borderRadius={'inherit'}
            >
              <Image
                src='/chart.svg'
                objectFit='contain'
                pl={'4'}
              />
              <Text color={'inherit'}>Achieve</Text>
            </Flex>
          </NavLink> */}
          {/* <NavLink to='/host'>
            <Flex
              gap='2'
              my={8}
              bgColor='inherit'
              margin={'inherit'}
              color={'inherit'}
              padding={'inherit'}
              borderRadius={'inherit'}
            >
              <Image
                src='/chart.svg'
                objectFit='contain'
                pl='4'
              />
              <Text color={'inherit'}>Achieve</Text>
            </Flex>
          </NavLink> */}
        </Flex>
        <HStack
          pb='2rem'
          onClick={() => {
            sessionStorage.clear()
            localStorage.clear()
            dispatch(logout())
            dispatch(clearSellerPeristData())
          }}
        >
          <Box
            _hover={{ cursor: 'pointer' }}
            display={'flex'}
            gap={'0.75rem'}
          >
            <Image src='/logout.svg' />
            <Text
              color={'#90A3BF'}
              fontSize={'1rem'}
            >
              Log out
            </Text>
          </Box>
        </HStack>
      </Flex>
    </Box>
  )
}
export default Sidebar
