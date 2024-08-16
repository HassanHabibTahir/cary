import React, { useRef } from 'react'
import { Box, Button, Image } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import { Line } from 'rc-progress'
import { RiDeleteBin6Line } from 'react-icons/ri'

import { ImageData } from './VehicleImages'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { removeAttachment } from '../../../store/features/seller/sellerSlice'

interface VehicleImagesCardProps {
  handleDrop: (e: React.DragEvent<HTMLDivElement>, item: ImageData) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void
  dragOver: boolean
  item: ImageData
  imageClickHandler: (e: React.ChangeEvent<HTMLInputElement>, item: ImageData) => void
  handledelete: (item: ImageData) => void
}

const ProofImageCard: React.FC<VehicleImagesCardProps> = ({
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleDragStart,
  dragOver,
  item,
  imageClickHandler,
  handledelete,
}) => {
  const imageUploader = useRef<HTMLInputElement>(null)
  const fileData = (item.file as any)?.data
  const sellerData = useAppSelector((state) => state.seller)
  const requiredUrl = sellerData.attachments?.find(
    (attachment) => attachment?.detail === item?.detail,
  )
  const dispatch = useAppDispatch()
  return (
    <Box
      height={200}
      width={'300px'}
      display={'flex'}
      flexDir={'column'}
      gap={2}
      justifyContent={'center'}
      alignItems={'center'}
      border={fileData ? '0px solid white' : '2px dashed #0054DA'}
      onDrop={(e) => handleDrop(e, item)}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDragStart={(e) => handleDragStart(e)}
      bg={dragOver ? 'gray.300' : 'White'}
      overflow={'hidden'}
    >
      {((item?.file !== null && fileData) || requiredUrl) && (
        <Box position={'relative'}>
          <Button
            position={'absolute'}
            right={5}
            top={5}
            bg={'red'}
            zIndex={1}
            onClick={() => {
              if (requiredUrl) {
                dispatch(removeAttachment(requiredUrl))
              }
              handledelete(item)
            }}
          >
            <RiDeleteBin6Line size={30} />
          </Button>
          {(item as any)?.progress?.percentage < 90 && (
            <Box
              border={fileData ? '0px solid white' : '2px dashed #0054DA'}
              position={'absolute'}
              height={'100%'}
              width={'100%'}
              bg={'rgb(254, 254, 254,0.2)'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Text color={'white'}> {item.file?.name?.slice(0, 15)}</Text>
                <Line
                  percent={(item as any)?.progress?.percentage}
                  strokeWidth={0.5}
                  strokeColor='#FEC809'
                  trailColor='#A98405'
                  style={{ borderRadius: '10px', height: 7, width: '80%' }}
                />
              </Box>
            </Box>
          )}

          <Image
            src={
              requiredUrl?.attachment_url
                ? `${requiredUrl?.attachment_url}`
                : URL.createObjectURL(fileData)
            }
            width={'100%'}
            height={'100%'}
            borderRadius={10}
            objectFit={'cover'}
          />
        </Box>
      )}
     {!fileData && !requiredUrl && (
        <>
          <input
            ref={imageUploader}
            accept='.jpg, .jpeg, .png' // Specify the file extensions
            type='file'
            style={{ position: 'absolute', opacity: 0 }}
            onChange={(e) => imageClickHandler(e, item)}
          />
          <Box>
            <Text
              type='upload_photos'
              size='15'
              textAlign={'center'}
            />
            <Text
              type={item?.title}
              size='15'
              textAlign={'center'}
            />
            <Text
              type='browse_file'
              size='15'
              color={'#0071F6'}
              textAlign={'center'}
            />
          </Box>
          <Button
            bg={'white'}
            border={'2px solid #21408E'}
            onClick={() => imageUploader.current?.click()}
          >
            <Text
              type='upload'
              size='15'
              textAlign={'center'}
              color={'#21408E'}
            />
          </Button>
        </>
      )}
    </Box>
  )
}

export default ProofImageCard
