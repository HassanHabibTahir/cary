import { Checkbox, Flex } from '@chakra-ui/react'
import SellerLayout from '../../../Components/SellerLayout'
import Text from '../../../Components/Text'
import { setActiveTab } from '../../../store/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { useState } from 'react'
export default function TermsRead() {
  const dispatch = useAppDispatch()
  const [terms, setterms] = useState([{ id: 1, text: 'lorem', term: false }])
  const sellerData = useAppSelector((state) => state.seller)

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

  const onNextClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab + 1))
  }
  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 1))
  }
  return (
    <SellerLayout
      submitBtnId={'infoSubmit'}
      onNextClick={onNextClick}
      showYear={false}
      isNextDisabled={terms?.filter((i) => !i.term).length > 0}
      onBackClick={onBackClick}
      showBackButton

    >
      <Text
        type='read_conditions'
        size='30'
        data-testId='read_conditions'
        weight='bold'
        textTransform={'uppercase'}
        mb={5}
      />
    
      {terms?.map((item) => {
        return (
          <Flex
            mt={5}
            alignItems={'flex-start'}
            gap={2}
            key={item?.id}
          >
            <Checkbox
              checked={terms?.find((i) => i.id === item?.id)?.term}
              onChange={(e) => handleTermChange(e.target.checked, item?.id)}
              size={'lg'}
              mt={1}
            />
            <Text
              type={item?.text}
              size='17'
              textAlign={'left'}
            />
          </Flex>
        )
      })}
    </SellerLayout>
  )
}
