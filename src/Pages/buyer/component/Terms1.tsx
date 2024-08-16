import { Box, Button, Checkbox, Container, Flex, Image, useMediaQuery } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Text from '../../../Components/Text'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
export default function Terms1() {
  // const dispatch = useAppDispatch()
  const [isMobile] = useMediaQuery('(max-width: 480px)') // Adjust the breakpoint as needed
  const { t } = useTranslation()

  const [terms, setterms] = useState([
    {
      id: 1,
      term: false,
    },
    {
      id: 2,
      term: false,
    },
    {
      id: 3,
      term: false,
    },
    {
      id: 4,
      term: false,
    },
    {
      id: 5,
      term: false,
    },
    {
      id: 6,
      term: false,
    },
    {
      id: 7,
      term: false,
    },
    {
      id: 8,
      term: false,
    },
    {
      id: 9,
      term: false,
    },
    {
      id: 10,
      term: false,
    },
    {
      id: 11,
      term: false,
    },
    {
      id: 12,
      term: false,
    },
    {
      id: 13,
      term: false,
    },
    {
      id: 14,
      term: false,
    },
    {
      id: 15,
      term: false,
    }
  ])
  const allChecked = Object.values(terms).every((term) => term.term)

  const navigate = useNavigate()
  const handleTermChange = (value: boolean, id: number) => {
    const update = terms?.map((item) => {
      if (item?.id === id) {
        return {
          ...item,
          term: value,
        }
      }
      return item
    })
    setterms(update)
  }

  const handleSubmit = () => {
    const allChecked = Object.values(terms).every((term) => term.term)
    if (allChecked) {
      navigate('vehicleinfo')
    }else{
      toast.error(t('read_agreement_error'))
    }
  }

  // const onNextClick = () => {
  //   dispatch(setActiveTab(1))
  // }
  return (
    <Container
      maxW='1440px'
      maxH={'100vh'}
    >
      <Box
        py={'6rem'}
        w={'100%'}
      >
        <Text
          type='How QuikAuction works'
          size={isMobile ? '1.43rem' : '2.43rem'}
          data-testId='how_quikauction_work'
          weight='bold'
          textAlign={'center'}
          mb={3}
          color={'#333333'}
        />
        <Text
          type='To agree place a checkmark in the box provided'
          size='1.5rem'
          mb='4rem'
          textAlign={'center'}
          color={'#333333'}
        />
        {terms?.map((item) => {
          return (
            <Flex
              mt={5}
              alignItems={'flex-start'}
              gap={2}
              key={item?.id}
              borderRadius='0.5rem'
              border={'0.7px solid #D9D9D9'}
              bgColor={'#F9F9F9'}
              p='1.5rem'
            >
              <Checkbox
                checked={terms?.find((i) => i.id === item?.id)?.term}
                onChange={(e) => handleTermChange(e.target.checked, item?.id)}
                size={'lg'}
                mt={1}
                _checked={{
                  '& .chakra-checkbox__control': { background: '#0054DA', border: 'none' },
                }}
              />
              <Text
                type={`buyer_agreement_${item?.id}`}
                textAlign={'left'}
                color={'#000000'}
                fontSize={'1.3125rem'}
                fontWeight={'400'}
              />
            </Flex>
          )
        })}
        <Box>
          {isMobile ? (
            // Wrap the button in a mobile-friendly container or apply additional styling
            <Button
              py={'1rem'}
              borderRadius={'0.375rem'}
              width={'100%'}
              bg={'brand.900'}
              onClick={() => navigate('vehicleinfo')}
              color={'white'}
              mt={'3.5rem'}
              display={'flex'}
              // flexDirection={'column'} // Display text and image in a column on mobile
              alignItems={'center'} // Center-align text and image
              mb={'1rem'} // Add margin at the bottom for spacing
              isDisabled={!allChecked}
            >
              <Text
                as='span'
                fontSize={'0.7rem'}
                noOfLines={2}
                textAlign='center'
                color={'white'}
                type='read_conditions'
              />

              <Image
                src='/Vector.svg'
                display={'inline'}
                pl={'0.1rem'}
                ml={1}
                verticalAlign={'middle'}
              />
            </Button>
          ) : (
            // Use your existing button code for larger screens
            <Button
              py={'1rem'}
              borderRadius={'0.375rem'}
              width={'auto'}
              bg={'brand.900'}
              onClick={handleSubmit}
              color={'white'}
              mt={'3.5rem'}
              display={'flex'}
              textAlign={'center'}
              ml={'auto'}
              // isDisabled={!allChecked}
            >
              <Text
                as='span'
                fontSize={'1rem'}
                type='read_conditions'
              >
              </Text>{' '}
              <Image
                src='/Vector.svg'
                display={'inline'}
                pl={'0.4rem'}
                verticalAlign={'middle'}
              />
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  )
}
