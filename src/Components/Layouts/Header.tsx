import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StatDownArrow,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { NavLink, Link as RRL, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/features/user/userSlice'
import { checkIfInterestProfileCompleted, getInterestProfile, getUserDetails } from '../../helper/CommonFunction'
import { clearSellerPeristData } from '../../store/features/seller/sellerSlice'
import { LanguageButtons } from './LanguageButtons'
import Text from '../Text'

// const Links = [
//   {
//     name: 'Home',
//     href: '/',
//   },
//   {
//     name: 'Our Reviews',
//     href: '/reviews',
//   },
//   {
//     name: 'FAQ',
//     href: '/faq',
//   },
//   {
//     name: 'About us',
//     href: '/about',
//   },
//   {
//     name: 'Contact',
//     href: '/contact',
//   },
// ]

const Links: any = []

export default function Header({ hideLinks }: { hideLinks?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const userData = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
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
  const isBuyer = userData?.userLoginInfo?.user_type?.toLowerCase() === 'buyer'
  const isUserTypeExist = userData?.userLoginInfo?.user_type || false
  const interestProfile = getInterestProfile(userData?.meData)
  const isInterestProfileCompleted = checkIfInterestProfileCompleted(isBuyer, userData, interestProfile)
  const isDashboardLinkShow = isInterestProfileCompleted && isUserTypeExist && isBuyer

  return (
    <>
      <HStack
        borderBottom={'1px solid #C2C2C2'}
        boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.00)'}
        justifyContent={'space-between'}
        px={{ base: '2rem', md: '7rem' }}
        py='1.25rem'
      >
        <Flex zIndex={999}>
          <RRL to='/'>
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
          </RRL>
        </Flex>
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
            <Flex
              pt={'3rem'}
              gap='2rem'
              alignItems={'center'}
              display={{ base: 'flex', md: 'none' }}
              flexDirection={'column'}
            >
              {!hideLinks &&
                <>
                  {Links?.map((link: any) => (
                    <Link
                      key={link.name}
                      as={NavLink}
                      to={link.href}
                      fontSize={'0.875rem'}
                      fontWeight={'500'}
                      color='#2E343F'
                      _activeLink={{ borderBottom: '1px solid #0054DA' }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </>
              }
              {userData?.meData ? (
                <Button
                  mt={5}
                  width={'80%'}
                  bg={'brand.900'}
                  colorScheme='blue'
                  color={'white'}
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
              ) : (
                <Button
                  mt={5}
                  width={'80%'}
                  bg={'brand.900'}
                  colorScheme='blue'
                  color={'white'}
                  _hover={{ bg: 'brand.800' }}
                  onClick={() => {
                    navigate('/login')
                  }}
                >
                  <Text
                    fontSize={'0.875rem'}
                    fontWeight={'500'}
                  >
                    Login
                  </Text>
                </Button>
              )}
            </Flex>
            <DrawerBody></DrawerBody>
          </DrawerContent>
        </Drawer>
        {!hideLinks &&
          <Flex
            gap='2rem'
            alignItems={'center'}
            display={{ base: 'none', lg: 'flex' }}
          >
            {Links?.map((link: any) => (
              <Link
                key={link.name}
                as={NavLink}
                to={link.href}
                fontSize={'0.875rem'}
                fontWeight={'500'}
                color='#2E343F'
                // py='1.25rem'
                _activeLink={{ borderBottom: '1px solid #0054DA' }}
              >
                {link.name}
              </Link>
            ))}
          </Flex>
        }
        <Flex
          alignItems={'center'}
          gap={'1.2rem'}
          display={{ base: 'none', md: 'flex' }}
        >
          {userData.isLogin ? (
            <Flex
              gap='0.75rem'
              alignItems={'center'}
            >
              <LanguageButtons />
              <Menu>
                <MenuButton
                  as='button'
                  sx={{
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <Text
                    as='p'
                    color='#333'
                    fontSize='1rem'
                    fontWeight='600'
                  >
                    {userName || '--'}
                    <Icon
                      as={StatDownArrow}
                      color='#333'
                      fontSize='1rem'
                      ml='0.5rem'
                    />
                  </Text>
                </MenuButton>
                <MenuList>
                  {isDashboardLinkShow &&
                    <MenuItem>
                      <Button
                        width={'100%'}
                        bg={'transparent'}
                        onClick={() => {
                          if (isBuyer) {
                            navigate('/buyer/listings')
                            return
                          } else if (!isUserTypeExist) {
                            navigate('/profile/vehicleinfo')
                            return
                          } else {
                            navigate('/seller')
                            return
                          }
                        }}
                      >
                        <Text as='p' color='#333' fontSize='1rem' fontWeight='600' type='dashboard' />
                      </Button>
                    </MenuItem>
                  }
                  <MenuItem>
                    <Button
                      width={'100%'}
                      bg={'transparent'}
                      onClick={() => {
                        dispatch(logout())
                        dispatch(clearSellerPeristData())
                        navigate('/')
                      }}
                    >
                      <Text as='p' color='#333' fontSize='1rem' fontWeight='600' type='logout' />
                    </Button>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ) : (
            <>
              <Link
                as={RRL}
                color='#2E343F'
                to={'/signup'}
              >
                Sign up
              </Link>
              <Link
                as={RRL}
                p={'0.75rem 1.25rem'}
                bgColor={'#0054DA'}
                color={'#ffffff'}
                borderRadius={' 0.375rem'}
                fontWeight={'500'}
                to='/login'
              >
                Login
              </Link>
            </>
          )}
        </Flex>
      </HStack>
      {/* <Box
        // bg={useColorModeValue('#24e081', 'gray.800')}
        bgColor={'white'}
        px={4}
      >
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <IconButton
            size={'md'}
            icon={isOpen ? <AiOutlineClose size={25} /> : <RxHamburgerMenu size={25} />}
            aria-label={'Open Menu'}
            display={{ base: 'flex', md: 'none' }}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={'center'}
          >
            <Box
              fontSize='24px'
              fontWeight='bold'
              textDecoration='none'
              color='black'
            >
              <Link to='/'>QuikAuction</Link>
            </Box>
          </HStack>
          <Flex alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <Switch
                size='md'
                isChecked={i18n.language === 'en'}
                onChange={() => i18n.changeLanguage(i18n.language === 'en' ? 'sp' : 'en')}
              />
              {Links.map((link) => (
                <NavLink
                  key={link.name}
                  {...link}
                />
              ))}
              <Button
                bg={'#0334BA'}
                mt={{ base: 0, md: '-5px' }}
                _hover={{ bg: '#002080' }}
                onClick={() => {
                  console.log('Button clicked')
                }}
              >
                <Text
                  size='17'
                  color={'white'}
                >
                  0312348334
                </Text>
              </Button>
              {userData?.isLogin ? (
                <Flex alignItems={'center'}>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}
                    >
                      <Avatar
                        size={'md'}
                        src={userData?.user.image}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Link 1</MenuItem>
                      <MenuItem>Link 2</MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onClick={() => {
                          dispatch(logout())
                          dispatch(setInitialState())
                          navigate('/')
                        }}
                      >
                        <Text type={'logout'} />
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              ) : (
                <Button
                  bg={'#0334BA'}
                  mt={{ base: 0, md: '-5px' }}
                  _hover={{ bg: '#002080' }}
                  onClick={() => {
                    navigate('/login')
                  }}
                >
                  <Text
                    size='17'
                    color={'white'}
                    type='login'
                  />
                </Button>
              )}
            </HStack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box
            pb={4}
            display={{ md: 'none' }}
          >
            <Stack
              as={'nav'}
              spacing={4}
            >
              {Links.map((link) => (
                <NavLink
                  key={link.name}
                  {...link}
                />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box> */}
    </>
  )
}
