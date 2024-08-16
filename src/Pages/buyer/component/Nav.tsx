import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { getUserDetails } from '../../../helper/CommonFunction'
import { logout } from '../../../store/features/user/userSlice'
import { clearSellerPeristData } from '../../../store/features/seller/sellerSlice'

type Props = {
  hideEditButton?: boolean
  hideDashboardButton?: boolean
}

const Nav = ({ hideEditButton, hideDashboardButton }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const userData = useAppSelector((state) => state.user)

  const userDetails = getUserDetails(userData)
  const getUserName = () => {
    if (!userDetails) {
      return userData?.meData?.email || ''
    }
    const name = userDetails?.isBuyer
      ? userDetails?.first_name || userData?.meData?.email || ''
      : userDetails?.contact_name || userDetails?.contact_email || userData?.meData?.email || ''
    return name
  }

  const userName = getUserName()

  return (
    <HStack
      as='nav'
      border='1px solid rgba(195, 212, 233, 0.40)'
      background='#ffffff'
      py='1.5rem'
      px='2.3rem'
      justifyContent='space-between'
    >
      <Link to='/'>
        <Image
          src='/logo.png'
          sx={{
            width: isMobile ? '10rem' : '15rem',
            zIndex: 999,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        />
      </Link>
      <Button
        bgColor='transparent'
        onClick={onOpen}
        display={{ base: 'block', md: 'none' }}
      >
        <GiHamburgerMenu />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody>
            <Box
              width={{ md: '24rem', lg: '18rem' }}
              background='white'
              height='56vh'
              pt='2rem'
            >
              <Flex
                direction='column'
                gap={7}
              >
                <Text
                  as='p'
                  color='rgba(148, 167, 203, 0.40);'
                  fontSize='0.75rem'
                  fontWeight='700'
                >
                  M A I N M E N U
                </Text>
                <Flex
                  direction={'column'}
                  gap='2rem'
                >
                  <NavLink
                    to='/buyer/listings'
                    end
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
                      <Image
                        src='/chart.svg'
                        objectFit={'contain'}
                        pl='4'
                      />
                      <Text color={'inherit'}>Open listing</Text>
                    </Flex>
                  </NavLink>
                  {/* <NavLink to='details'>
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
                  <Button
                    width={'full'}
                    bg={'brand.900'}
                    colorScheme='blue'
                    color={'white'}
                    mt={8}
                    _hover={{ bg: 'brand.800' }}
                    onClick={() => {
                      dispatch(logout())
                      dispatch(clearSellerPeristData())
                      navigate('/login')
                    }}
                  >
                    <Text
                      fontSize={'0.875rem'}
                      fontWeight={'500'}
                    >
                      Log out
                    </Text>
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box display={{ base: 'none', md: 'block' }}>
        <Flex
          gap='0.75rem'
          alignItems={'center'}
        >
          <Menu>
            <MenuButton as='button'>
              {/* <Image src='/avatar.svg' /> */}
              <Text
                as='p'
                color='#333'
                fontSize='1.3rem'
                fontWeight='600'
              >
                {userName || '--'}
              </Text>
            </MenuButton>
            <MenuList>
              {!hideDashboardButton && (
                <MenuItem>
                  <Link
                    to='/buyer/listings'
                    style={{ width: '100%' }}
                  >
                    Dashboard
                  </Link>
                </MenuItem>
              )}
              {!hideEditButton && (
                <MenuItem>
                  <Link
                    to='info'
                    style={{ width: '100%' }}
                  >
                    Edit profile
                  </Link>
                </MenuItem>
              )}
              <MenuItem>
                <div
                  // to='info'
                  style={{ width: '100%' }}
                  onClick={() => {
                    dispatch(logout())
                    dispatch(clearSellerPeristData())
                    navigate('/')
                  }}
                >
                  Log out
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </HStack>
  )
}
export default Nav
