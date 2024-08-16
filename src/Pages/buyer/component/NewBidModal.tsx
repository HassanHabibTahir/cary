import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from '@chakra-ui/react'
import Text from '../../../Components/Text'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { postNewBid } from '../../../store/features/seller/sellerAction'
import { unwrapResult } from '@reduxjs/toolkit'
interface Props {
  isOpen: boolean
  onClose: () => void
}
export default function NewBidModal({ isOpen, onClose }: Props) {
  if (!isOpen) {
    return
  }
  const [loading, setloading] = useState(false)
  const currentListing = useAppSelector((state) => state.seller.singleListing)

  const currentBid = currentListing.currentBid ?? 0

  const [newBid, setnewBid] = useState(currentBid)
  const dispatch = useAppDispatch()
  const NewBidHandler = () => {
    setloading(true)

    dispatch(
      postNewBid({
        listing_id: currentListing?.listing.id,
        amount_currency: '$',
        amount_cents: newBid,
      }),
    )
      .then(unwrapResult)
      .then(() => {
        onClose()
        setloading(false)
      })
      .catch((err) => {
        console.log('err', err)
        setloading(false)
      })
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Bid</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            flexDirection={'column'}
            alignItems={'center'}
          >
            <Button
              fontFamily={'heading'}
              mt={8}
              bg='green'
              color={'white'}
              onClick={() => {}}
            >
              <Flex>
                <Text
                  size='20'
                  type='yourcurrentBid'
                />
                <Text size='20'>{`${currentBid}`}</Text>
              </Flex>
            </Button>
            <Text
              size='30'
              mt={5}
              type='your_new_bid'
            />
          </Flex>
          <Input
            placeholder='Enter New Bid'
            value={newBid}
            mt={2}
            type='number'
            onChange={(e) => {
              e.preventDefault()
              setnewBid(e.target.value as unknown as number)
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            fontFamily={'heading'}
            data-testId='signup-button'
            h={'40px'}
            bg={'brand.900'}
            color={'white'}
            onClick={NewBidHandler}
            isLoading={loading}
          >
            <Text
              color={'#FFFFFF'}
              size='22'
              weight='600'
              type={'confirm_bid'}
              fontFamily={'Poppins'}
            />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
