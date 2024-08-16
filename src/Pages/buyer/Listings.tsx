import { Stack, Flex, Box, Spinner, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import { Link } from 'react-router-dom'
import { getAllListings } from '../../store/features/seller/sellerAction'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import CarCard from './CarCard'

const OpenListing = () => {
  const [loader, setloader] = useState(false)
  const allListings = useAppSelector((state) => state.seller.allListings)
  const myBids = useAppSelector((state) => state.seller.myBids)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (allListings.length === 0) setloader(true)
    dispatch(getAllListings())
      .then(unwrapResult)
      .then(() => {
        setloader(false)
      })
      .catch(() => {
        setloader(false)
      })
  }, [])

  const getFirstImage = (item: any) => {
    if (!item) return '/cardPlaceholder.jpg'
    if (item?.photo_attachments?.length === 0) return '/cardPlaceholder.jpg'
    return item?.photo_attachments[0]?.url ?? '/cardPlaceholder.jpg'
  }

  return (
    <Stack
      spacing='1.5rem'
      height={'78vh'}
    >
      {loader ? (
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'100%'}
          width={'100%'}
        >
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Box>
      ) : (
        <Flex
          wrap={'wrap'}
          gap={'1.5rem'}
          justifyContent={'flex-start'}
          alignContent={'flex-start'}
          height={'100%'}
        >
          {allListings?.length === 0 ? (
            <Flex
              height={'100%'}
              justifyContent={'center'}
              alignItems={'center'}
              width={'100%'}
            >
              <Image src='/noRecord.png' />
            </Flex>
          ) : (
            <>
              {allListings.map((list) => (
                <Link
                  to={`${list.control_number}`}
                  key={list.control_number}
                >
                  <CarCard
                    title={list.make}
                    year={Number(list.year)}
                    model={list.model}
                    src={getFirstImage(list)}
                    bidding_enabled={list?.bidding_enabled}
                    currentBid={myBids[list?.id]?.bid ?? 0}
                  />
                </Link>
              ))}
            </>
          )}
        </Flex>
      )}
    </Stack>
  )
}
export default OpenListing
