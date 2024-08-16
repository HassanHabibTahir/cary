import { Box, Flex } from '@chakra-ui/react'
import { Footer } from './Footer'
import Header from './Header'
import { css } from '@emotion/react'

const scrollBarStyles = css`
  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #0054da;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &::-moz-scrollbar {
    width: 7px;
  }

  &::-moz-scrollbar-track {
    background: #0054da;
  }

  &::-moz-scrollbar-thumb {
    background: #0054da;
    border-radius: 10px;
  }

  &::-moz-scrollbar-thumb:hover {
    background: #555;
  }
`

type MainLayoutProps = {
  children: React.ReactNode
  hideLinks?: boolean
}

export default function MainLayout({ children, hideLinks }: MainLayoutProps) {
  return (
    <Flex
      direction='column'
      height='100vh'
      w={'100%'}
    >
      <Header hideLinks={hideLinks} />
      <Box
        flex='1'
        overflowY='auto'
        css={scrollBarStyles}
      >
        {children}
      </Box>
      <Footer />
    </Flex>
  )
}
