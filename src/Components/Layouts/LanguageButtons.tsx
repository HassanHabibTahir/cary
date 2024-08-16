import { Flex, Button, Menu, MenuButton, MenuList, MenuGroup, MenuItem, Icon, StatDownArrow } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { userApi } from '../../store/features/user/userApi';
import { useTranslation } from 'react-i18next';
import { senitizePreferredLanguage } from '../../helper/CommonFunction';
import { updatePreferredLanguage } from '../../store/features/user/userSlice';

export const LanguageButtons = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch()
  const userDetails = useAppSelector((state) => state.user);
  const userId = userDetails?.meData?.id || '';
  const token = userDetails?.userLoginInfo?.token || '';

  const handleChangeLanguage = async (lang: string) => {
    const response = await userApi.updateUser(userId, { preferred_language: lang }, token);
    if (response) {
      const newLang = lang === 'es' ? 'sp' : lang;
      i18n.changeLanguage(newLang);
      dispatch(updatePreferredLanguage(lang));
    }
  }

  const preferred_language = senitizePreferredLanguage(userDetails?.meData?.preferred_language || 'en');

  return (
    <Flex display={{ base: 'none', md: 'flex' }}>
      <Menu>
        <MenuButton
          as={Button}
          bgColor='brand.900'
          color={'white'}
          // leftIcon={(
          //   <Image
          //     src={preferred_language === 'en' ? '/united-kingdom.png' : '/flag.png'}
          //     alt='us-flag'
          //     sx={{
          //       width: '2.5rem',
          //       height: '2rem',
          //       padding: '0.25rem',
          //     }}
          //   />
          // )}
          rightIcon={(
            <Icon
              as={StatDownArrow}
              sx={{
                width: '1.2rem',
                height: '1.2rem',
                padding: '0.25rem',
              }}
            />
          )}
        >
          {preferred_language === 'en' ? 'English' : 'Spanish'}
        </MenuButton>
        <MenuList>
          <MenuGroup title='Language'>
            <MenuItem onClick={() => handleChangeLanguage('en')}>English</MenuItem>
            <MenuItem onClick={() => handleChangeLanguage('es')}>Spanish</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Flex>
  )
}
