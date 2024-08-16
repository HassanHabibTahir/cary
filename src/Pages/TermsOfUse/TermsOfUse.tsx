import MainLayout from '../../Components/Layouts/MainLayout'
import { Box, Image, Stack, Container, SimpleGrid } from '@chakra-ui/react';
import Text from '../../Components/Text';

export default function TermsOfUse() {
  return (
    <>
      <MainLayout>
        <Box p={10}>
          <Box position={'relative'}>
            <Box height={'100%'} w={'100%'}>
              <Container
                as={SimpleGrid}
                maxW={'8xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}
                height={'auto'}
              >
                <Box>
                  <Text color="gray.500">
                    Current as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </Text>
                  <Text
                    fontSize="4xl"
                    color="gray.900"
                    fontWeight="bold"
                    lineHeight="shorter"
                    mt={5}
                    type='Terms of Use'
                  />
                  <Text
                    fontSize="lg"
                    color="gray.500"
                    mt={4}
                    ml={2}
                  >
                    By accessing our website, you are agreeing to be bound by these terms of service,
                    and agree that you are responsible for compliance with any applicable local laws.
                  </Text>
                </Box>
                <Stack>
                  <Image
                    src="/terms-of-use.jpg"
                    alt="Illustration of a person signing a document"
                    borderRadius={8}
                  />
                </Stack>
              </Container >
            </Box >
          </Box>
        </Box>
      </MainLayout>
    </>
  )
}
