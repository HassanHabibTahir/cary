import { useEffect, useState } from 'react'
import { generateRandomString } from '../../../../../helper/CommonFunction'
import {
  Button,
  Flex,
  IconButton,
  NumberInput,
  NumberInputField,
  useBreakpointValue,
} from '@chakra-ui/react'
import { PiMinus } from 'react-icons/pi'
import { InterestProfileDetails } from '../InterestProfileStepsWrapper'
import './styles.css'

interface AttributeRowInputProps {
  attributes: any[]
  onChange: (attributes: any) => void
  interestProfile: InterestProfileDetails
}

type AttributesType = {
  id: string
  prefrence_id: number | undefined
  max_distance?: string
  amount_cents?: string
}

const AttributeRowInput = ({
  attributes,
  interestProfile,
  onChange,
}: AttributeRowInputProps): JSX.Element => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const maxPickupDistance = interestProfile?.max_pickup_distance || 0
  const [inputFields, setInputFields] = useState<AttributesType[]>([
    {
      id: generateRandomString(50),
      prefrence_id: undefined,
      max_distance: undefined,
      amount_cents: undefined,
    },
  ])

  useEffect(() => {
    if (attributes.length > 0) {
      setInputFields(
        attributes.map((attribute) => ({
          id: generateRandomString(50),
          ...attribute,
        })),
      )
    }
  }, [attributes])

  const getOptions = () => {
    const options = []
    for (let i = 10; i <= maxPickupDistance; i += 10) {
      options.push({ value: i?.toString(), label: i.toString() + ' miles' })
    }
    if (maxPickupDistance % 10 !== 0) {
      options.push({ value: maxPickupDistance, label: maxPickupDistance.toString() + ' miles' })
    }
    return options
  }
  const avialableOptions = getOptions()

  const handleChangeInput = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    event.preventDefault()
    const values = [...inputFields]
    const index = values.findIndex((value) => value.id === id)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    values[index][event?.target?.name] = event.target.value
    setInputFields(values)
    onChange(
      values.map((value) => ({
        prefrence_id: value.prefrence_id,
        max_distance: value?.max_distance || avialableOptions?.[0]?.value || 10,
        amount_cents: value.amount_cents,
      })),
    )
  }

  const findNextValueAfter = (value: any, array: any) => {
    try {
      const findItem = array.find((option: any) => option.value == value)
      if (findItem) {
        const index = array.indexOf(findItem)
        if (index !== -1 && index + 1 < array.length) {
          return array[index + 1].value
        }
      }
      return array[0].value
    } catch (error) {
      return '10'
    }
  }

  const handleAddFields = (): void => {
    const nextHighestValue =
      findNextValueAfter(inputFields[inputFields.length - 1]?.max_distance, avialableOptions) ||
      '10'
    const newFields = [
      ...inputFields,
      {
        id: generateRandomString(50),
        prefrence_id: undefined,
        max_distance: nextHighestValue,
        amount_cents: undefined,
      },
    ]

    onChange(newFields)
    setInputFields(newFields as any)
  }

  const handleRemoveFields = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    event.preventDefault()
    const values = [...inputFields]
    values.splice(
      values.findIndex((value) => value.id === id),
      1,
    )
    onChange(values)
    setInputFields(values)
  }
  const format = (val: string) => `$` + val
  const parse = (val: string) => val.replace(/^\$/, '')

  const isOptionAlreadySelectedInPreviousTiers = (option: any) => {
    let isOptionAlreadySelected = false
    for (let i = 0; i < inputFields.length - 1; i++) {
      const currentSelectedValue = Number(inputFields[i]?.max_distance || 0)
      if (parseInt(option.value) === currentSelectedValue) {
        isOptionAlreadySelected = true
        break
      }
    }
    return isOptionAlreadySelected
  }

  const isOptionLessThanPreviousTiers = (option: any) => {
    let isOptionLessThanPreviousTiers = false
    for (let i = 0; i < inputFields.length - 1; i++) {
      const currentSelectedValue = Number(inputFields[i]?.max_distance || 0)
      if (parseInt(option.value) < currentSelectedValue) {
        isOptionLessThanPreviousTiers = true
        break
      }
    }
    return isOptionLessThanPreviousTiers
  }

  const [disableAddBtn, setDisableAddBtn] = useState(false)
  const disableAddAnotherTier =
    inputFields.length === avialableOptions.length ||
    disableAddBtn ||
    inputFields[inputFields.length - 1]?.amount_cents == undefined

  useEffect(() => {
    const isMaxOptionSelected = inputFields.some(
      (item) => parseInt(item.max_distance || '0') === maxPickupDistance,
    )
    setDisableAddBtn(isMaxOptionSelected)
  }, [inputFields, avialableOptions])

  return (
    <div className={'container'}>
      <table className={'_table'}>
        <thead>
          <tr>
            <th>Within:</th>
            <th style={{ width: isMobile ? '45%' : '50%' }}>Automatic Bid:</th>
            <th style={{ width: '50px' }}></th>
          </tr>
        </thead>
        <tbody id='table_body'>
          {inputFields.map((inputField, index) => (
            <tr key={index}>
              <td>
                <select
                  name='max_distance'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    handleChangeInput(inputField.id, e)
                  }}
                  className={'form_control'}
                  value={inputField?.max_distance || ''}
                  disabled={index !== inputFields.length - 1}
                >
                  {avialableOptions?.map((option: any) => {
                    return (
                      <option
                        key={option.value}
                        value={option.value || ''}
                        disabled={isOptionAlreadySelectedInPreviousTiers(option)}
                        style={{
                          display:
                            isOptionLessThanPreviousTiers(option) ||
                            isOptionAlreadySelectedInPreviousTiers(option)
                              ? 'none'
                              : 'block',
                        }}
                      >
                        {option.label}
                      </option>
                    )
                  })}
                </select>
              </td>
              <td>
                <NumberInput
                  placeholder='$0.00'
                  // isDisabled={index !== inputFields.length - 1}
                  onChange={(valueString) => {
                    if (valueString.length > 0 && Number(parse(valueString)) < 0) {
                      return
                    }

                    const event = {
                      preventDefault: () => {},
                      target: {
                        name: 'amount_cents',
                        value: Number(parse(valueString)),
                      },
                    }
                    handleChangeInput(inputField.id, event as any)
                  }}
                  value={format(inputField.amount_cents?.toString() || '') || ''}
                >
                  <NumberInputField placeholder='$0.00' />
                </NumberInput>
              </td>
              <td>
                {index > 0 && (
                  <div className={'action_container'}>
                    <IconButton
                      colorScheme='red'
                      aria-label='Search database'
                      icon={<PiMinus />}
                      onClick={(e) => {
                        handleRemoveFields(inputField.id, e)
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Flex
        mb={0}
        mt={10}
        justify={'center'}
        align={'center'}
      >
        <Button
          variant='solid'
          colorScheme={disableAddAnotherTier ? 'gray' : 'blue'}
          w={'70%'}
          cursor={disableAddAnotherTier ? 'not-allowed' : 'pointer'}
          p={7}
          disabled={disableAddAnotherTier}
          onClick={() => {
            if (!disableAddAnotherTier) {
              handleAddFields()
            }
          }}
        >
          Add another tier
        </Button>
      </Flex>
    </div>
  )
}

export default AttributeRowInput
