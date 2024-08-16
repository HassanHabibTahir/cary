import React, { ChangeEvent } from 'react'
import { Box, Input } from '@chakra-ui/react'
import Text from './Text'

interface SelectFileProps {
  labelType: string
  handleFileChange: (file: File) => void
}

const SelectFile: React.FC<SelectFileProps> = ({ labelType, handleFileChange }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  return (
    <Box mt={2}>
      <Text
        type={labelType}
        size='17'
        mb={2}
      />
      <Input
        placeholder='default placeholder'
        type='file'
        h={50}
        onChange={handleInputChange}
      />
    </Box>
  )
}

export default SelectFile
