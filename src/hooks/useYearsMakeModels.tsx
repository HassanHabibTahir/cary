import { useState, useEffect } from 'react'
import { sellerApi } from '../store/features/seller/sellerApi'

enum DropdownType {
  Year = 'year',
  Make = 'make',
  Model = 'model',
}

type Options = {
  label: string
  value: string
}

type Dropdowns = {
  years: Options[]
  makes: Options[]
  models: Options[]
}

const useYearsMakeModels = () => {
  const [dropdowns, setDropdowns] = useState<Dropdowns>({
    years: [],
    makes: [],
    models: [],
  })

  const handleFetchByDropdownType = async (
    type: DropdownType,
    year: string = '',
    make: string = '',
  ) => {
    switch (type) {
      case DropdownType.Year: {
        const yearsApiResponse = await sellerApi.getYears()
        const years = yearsApiResponse?.years ?? []
        if (years.length > 0) {
          const sortedYears = years.sort((a: string, b: string) => Number(b) - Number(a))
          const removeFutureYears = sortedYears.filter(
            (item: string) => Number(item) <= new Date().getFullYear(),
          )
          setDropdowns({
            ...dropdowns,
            years: removeFutureYears.map((item: string) => ({ label: item, value: item })),
            makes: [],
            models: [],
          })
        }
        return years
      }
      case DropdownType.Make: {
        const makesApiResponse = await sellerApi.getMakes(year)
        const makes = makesApiResponse?.makes ?? []
        if (makes.length > 0) {
          setDropdowns({
            ...dropdowns,
            makes: makes.map((item: string) => ({ label: item, value: item })),
            models: [],
          })
        }
        return makes
      }
      case DropdownType.Model: {
        const modelsApiResponse = await sellerApi.getModels(year, make)
        const models = modelsApiResponse?.models ?? []
        if (models.length > 0) {
          setDropdowns({
            ...dropdowns,
            models: models.map((item: string) => ({ label: item, value: item })),
          })
        }
        return models
      }
      default:
        return ''
    }
  }

  const fetchAllYearsMakesAndModelsTogether = async (year: string, make: string) => {
    try {
      const yearsApiResponse = await sellerApi.getYears()
      const makesApiResponse = await sellerApi.getMakes(year)
      const modelsApiResponse = await sellerApi.getModels(year, make)
      const years = yearsApiResponse?.years ?? []
      const makes = makesApiResponse?.makes ?? []
      const models = modelsApiResponse?.models ?? []

      const sortedYears = years.sort((a: string, b: string) => Number(b) - Number(a))
      const removeFutureYears = sortedYears.filter(
        (item: string) => Number(item) <= new Date().getFullYear(),
      )
      setDropdowns({
        ...dropdowns,
        years: removeFutureYears.map((item: string) => ({ label: item, value: item })),
        makes: makes.map((item: string) => ({ label: item, value: item })),
        models: models.map((item: string) => ({ label: item, value: item })),
      })
    } catch (error) {
      console.log('something went wring while fetching years makes and models', error)
    }
  }

  useEffect(() => {
    handleFetchByDropdownType(DropdownType.Year)
  }, [])

  const onYearChange = async (selectedYear: string) => {
    await handleFetchByDropdownType(DropdownType.Make, selectedYear)
  }

  const onMakeChange = async (selectedYear: string, selectedMake: string) => {
    await handleFetchByDropdownType(DropdownType.Model, selectedYear, selectedMake)
  }

  const fetchMakesOnly = async (year: string) => {
    const makesApiResponse = await sellerApi.getMakes(year)
    const makes = makesApiResponse?.makes ?? []
    if (makes.length > 0) {
      setDropdowns({
        ...dropdowns,
        makes: makes.map((item: string) => ({ label: item, value: item })),
      })
    }
  }

  return { dropdowns, onYearChange, onMakeChange, fetchAllYearsMakesAndModelsTogether, fetchMakesOnly }
}

export default useYearsMakeModels
