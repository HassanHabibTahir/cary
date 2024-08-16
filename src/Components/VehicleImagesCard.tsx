import React, { useRef } from 'react'
import { Box, Button, Image, useBreakpointValue } from '@chakra-ui/react'
import Text from './Text'
import { Line } from 'rc-progress'
import { RiDeleteBin6Line } from 'react-icons/ri'

import { ImageData } from '../Pages/Seller/component/VehicleImages'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { removeAttachment } from '../store/features/seller/sellerSlice'

interface VehicleImagesCardProps {
  handleDrop: (e: React.DragEvent<HTMLDivElement>, item: ImageData) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void
  dragOver: boolean
  item: ImageData
  imageClickHandler: (e: React.ChangeEvent<HTMLInputElement>, item: ImageData) => void
  handledelete: (item: ImageData) => void
  onCaptureClick?: (item: ImageData) => void
}

const VehicleImagesCard: React.FC<VehicleImagesCardProps> = ({
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleDragStart,
  dragOver,
  item,
  imageClickHandler,
  handledelete,
  onCaptureClick,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const imageUploader = useRef<HTMLInputElement>(null)
  const fileData = (item.file as any)?.data
  const sellerData = useAppSelector((state) => state.seller)
  const requiredUrl = sellerData.attachments?.find(
    (attachment) => attachment?.detail === item?.detail,
  )
  const dispatch = useAppDispatch()

  const BottomMobilCTA = () => {
    return (
      <Box>
        <Button
          bg={'brand.900'}
          alignSelf={'center'}
          mt={5}
          onClick={() => imageUploader.current?.click()}
          position={'absolute'}
          bottom={'20px'}
          left={'30px'}
        >
          <Text
            type='upload'
            size='15'
            color={'white'}
            textAlign={'center'}
            fontWeight={600}
          />
        </Button>
        <Button
          bg={'brand.900'}
          alignSelf={'center'}
          mt={5}
          onClick={() => {
            if (onCaptureClick) {
              onCaptureClick(item)
            }
          }}
          position={'absolute'}
          bottom={'20px'}
          right={'30px'}
        >
          <Text
            type='capture'
            size='15'
            color={'white'}
            textAlign={'center'}
            fontWeight={600}
          />
        </Button>
      </Box>
    )
  }

  const BottomDesktopCTA = () => {
    return (
      <Box>
        <Button
          bg={'brand.900'}
          alignSelf={'center'}
          mt={5}
          onClick={() => imageUploader.current?.click()}
          position={'absolute'}
          bottom={'20px'}
          left={'35%'}
        >
          <Text
            type='upload'
            color={'white'}
            size='15'
            textAlign={'center'}
            fontWeight={600}
          />
        </Button>
      </Box>
    )
  }

  return (
    <Box
      height={200}
      width={isMobile ? '100%' : '30%'}
      gap={2}
      // justifyContent={'center'}
      alignItems={'center'}
      border={fileData ? '0px solid white' : '2px dashed #0054DA'}
      onDrop={(e) => handleDrop(e, item)}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDragStart={(e) => handleDragStart(e)}
      bg={dragOver ? 'gray.300' : 'White'}
      overflow={'hidden'}
      p={2}
      position={'relative'}
    >
      {((item?.file !== null && fileData) || requiredUrl) && (
        <Box
          position={'relative'}
          width={'100%'}
          height={'100%'}
          borderRadius={10}
        >
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
          {(item as any)?.progress?.percentage < 99 && (
            <Box
              border={fileData ? '0px solid white' : '2px dashed #195DFF'}
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
          <Box
            flex={1}
            display={'flex'}
            flexDirection={'column'}
          >
            <input
              ref={imageUploader}
              type='file'
              accept='image/*'
              capture='environment'
              style={{ position: 'absolute', opacity: 0 }}
              onChange={(e) => imageClickHandler(e, item)}
            />
            <Box>
         
              <Text
                type={item?.title}
                size='15'
                textAlign={'center'}
                width={'100%'}
                maxWidth={'120px'}
              />
            </Box>
            {item?.backImage.length > 0 ? (
              <Box
        
              >
                <Image
                  src={item?.backImage}
                  width={'100%'}
                  height={'92px'}
                  
                />
              </Box>
            ) : (
              <Box></Box>
            )}
            {isMobile ? <BottomMobilCTA /> : <BottomDesktopCTA />}
          </Box>
        </>
      )}
    </Box>
  )
}

export default VehicleImagesCard
