import { Box } from '@chakra-ui/react'

import Text from '../Text'

interface Props {
  name: string
  href: string
}

const NavLink = (props: Props) => {
  const { name, href } = props

  return (
    <Box
      as='a'
      px={2}
      py={1}
      rounded={'md'}
      href={href}
    >
      <Text
        type={name}
        fontWeight='bold'
      />
    </Box>
  )
}

export default NavLink
