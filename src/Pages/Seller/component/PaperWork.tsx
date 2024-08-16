import React, { useMemo, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import Text from '../../../Components/Text'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import SellerLayout from '../../../Components/SellerLayout'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab, updateAttachment } from '../../../store/features/seller/sellerSlice'
import ProofImageCard from './ProofImageCard'
import { Attachment_Response } from '../../../types/listingApiTypes'

export interface ImageData {
  id: number
  title: string
  file: File | null
  backImage: string
  detail?:string
  attachmentResponse: Attachment_Response | null

}

// Define a custom FileWithId interface that extends the built-in File interface
export interface FileWithId extends File {
  id: any
  data: any
  progress: any
}
const ImageDummyData: ImageData[] = [
  {
    id: 1,
    title: 'fot',
    file: null,
    backImage: '',
    detail: 'front',
    attachmentResponse: null,
  },
  {
    id: 2,
    title: 'bot',
    file: null,
    backImage: '',
    detail: 'back',
    attachmentResponse: null,
  },
]
export default function PaperWork() {
  const dispatch = useAppDispatch()
  const sellerData = useAppSelector((state) => state.seller)
  const currentListingId = sellerData.currentListing.listing.id
  const [imagesList, setimagesList] = useState<ImageData[]>(ImageDummyData)
  const [dragOver, setdragOver] = useState(false)
  useMemo(() => {
    const ImageDummyData: ImageData[] = [
      {
        id: 1,
        title: 'fot',
        file: null,
        backImage: '',
        detail: 'front',
      },
      {
        id: 2,
        title: 'bot',
        file: null,
        backImage: '',
        detail: 'back',
      },
    ]?.map((item) => {
      return {
        ...item,
        attachmentResponse:
          sellerData.attachments?.find((attachment) => attachment?.detail === item?.detail) ?? null,
      }
    })
    setimagesList(ImageDummyData)
  }, [sellerData.attachments])
  const FileUploadHnadler = async (files: FileList | null, image: ImageData) => {
    console.log('image', image)
    if (!files?.length) {
      alert('Please try again')
      return
    }
    const uppy = new Uppy({
      id: 'uppyUploader',
      autoProceed: true,
      restrictions: {
        maxFileSize: 5242880,
      },
    }).use(XHRUpload, {
      endpoint: 'https://staging-api.cfc-d2.com/attachments',
      method: 'POST',
      formData: true,
      fieldName: 'attachment[file]',
      allowedMetaFields: [
        'attachment[listing_id]',
        'attachment[attachment_type]',
        'attachment[detail]',
      ],
    })
    const file = files[0]
    const readAsArrayBufferPromise = new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result !== null) {
          const blob = new Blob([reader.result], { type: file.type })
          uppy.addFile({
            name: file?.name,
            type: file?.type,
            data: blob,
            source: 'Local',
            isRemote: false,
            meta: {
              'attachment[attachment_type]': 'proof_of_ownership_attachment',
              'attachment[listing_id]': currentListingId,
              'attachment[detail]': image?.detail,
            },
          })
          resolve()
        } else {
          reject(new Error('File could not be processed.'))
        }
      }
      reader.onerror = () => {
        reject(new Error('Error reading file.'))
      }
      reader.readAsArrayBuffer(file)
    })

    try {
      await readAsArrayBufferPromise
      uppy.upload().then((result) => {
        const attachmentResponse = (result.successful[0] as any).response?.body
        if (attachmentResponse) {
          dispatch(updateAttachment(attachmentResponse))
        }
        if (result.failed.length > 0) {
          console.error('Errors:')
          result.failed.forEach((file) => {
            console.error(file.error)
          })
        }
      })
      uppy.on('upload-progress', (file, progress) => {
        const progressPercent = Math.round((progress.bytesUploaded / progress.bytesTotal) * 100)
        setimagesList((prev) => {
          return prev?.map((item) => {
            if ((item?.file as any)?.id === file?.id) {
              return {
                ...item,
                progress: {
                  ...progress,
                  percentage: progressPercent,
                },
              }
            }
            return item
          })
        })
      })
      uppy.on('upload-success', (file, response) => {
        console.log('upload-success', file.name, response.uploadURL)
      })
      uppy.on('upload-error', (file, response) => {
        console.log('upload-error', file)
        console.log('upload-error', response?.message)
      })
      const allFiles = uppy.getFiles()
      const refactorData = imagesList?.map((item) => {
        if (item?.id === image?.id) {
          return {
            ...image,
            file: allFiles[0],
          }
        }
        return item
      })
      console.log('render')
      setimagesList(refactorData)
    } catch (error) {
      console.error('Error reading files:', error)
    }
  }

  const imageClickHandler = async (e: React.ChangeEvent<HTMLInputElement>, image: ImageData) => {
    e.preventDefault()
    const files = e.target.files
    await FileUploadHnadler(files, image)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, image: ImageData) => {
    e.preventDefault()
    setdragOver(false)

    const files = e.dataTransfer.files
    await FileUploadHnadler(files, image)
  }
  const handledelete = (image: ImageData) => {
    const filterList = imagesList?.map((i) => {
      if (i.id == image.id) {
        return {
          ...image,
          file: null,
        }
      }
      return i
    })
    setimagesList(filterList)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setdragOver(true)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setdragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setdragOver(false)
  }
  const onNextClick = () => {
    dispatch(setActiveTab(sellerData.activeTab + 1))
  }
  const onBackClick = () => {
    dispatch(setActiveTab(sellerData?.activeTab - 2))
  }
  const nullFiles = imagesList?.filter((file) => file?.attachmentResponse === null)

  return (
    <SellerLayout
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      showYear={true}
      showBackButton
      isNextDisabled={nullFiles?.length >0}
    >
      <Text
        type='post_vehicle'
        size='27'
        weight='bold'
      />

      <Text
        type='paper_desc'
        size='20'
        weight='bold'
      />
      <Flex
        gap={2}
        flexWrap={'wrap'}
        justifyContent={'center'}
        mt={8}
      >
        {imagesList
          ?.sort((a, b) => a.id - b.id)
          ?.map((item) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <ProofImageCard
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDragStart={handleDragStart}
                dragOver={dragOver}
                item={item}
                handledelete={handledelete}
                imageClickHandler={imageClickHandler}
                key={item.id}
              />
            )
          })}
      </Flex>
    </SellerLayout>
  )
}
