import { Box, Image } from '@chakra-ui/react'
import Lottie from 'lottie-react'
import animation from '../../../public/lottie/CheckMarkAnimation.json'
import Text from '../Text'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function FeedbackSubmittedAnimation() {
  const { t } = useTranslation()
  return (
    <>
      <Box
        h={200}
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box
          height={150}
          width={150}
          borderRadius={'50%'}
          p={2}
          zIndex={1}
          mb={'-60px'}
          data-testid='outer-circle'
        >
          <Box
            height={'100%'}
            width={'100%'}
            borderRadius={'50%'}
            bg={'white'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            data-testid='inner-circle'
          >
            <Lottie
              animationData={animation}
              style={{ width: '100%', height: '100%' }}
              loop={false}
            />
          </Box>
        </Box>
      </Box>
      <Box
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text
          type='you_are_all_set'
          size='25'
          weight='bold'
          color={'brand.900'}
          textTransform={'uppercase'}
        />
      </Box>
      <Box
        h={100}
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text
          type='initial_setup_message'
          size='15'
          textAlign={'center'}
          color={'gray'}
        />
      </Box>
      <Box
        display={'flex'}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Link
          to={import.meta.env.VITE_APP_COPART_MEMBER_PORTAL_URL}
          target='_self'
          style={{
            textDecoration: 'none',
            color: '#0054DA',
            fontSize: '15px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginTop: 8,
            textDecorationLine: 'underline',
          }}
        >
          <Image
            src='/copartLogo.png'
            alt='Copart'
            cursor={'pointer'}
            width={160}
          />
          <div style={{
            marginTop: '5px',
            textAlign: 'center'
          }}>{t('member_portal')}</div>
        </Link>
      </Box>
    </>
  )
}
