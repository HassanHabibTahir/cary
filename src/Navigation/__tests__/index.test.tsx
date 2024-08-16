import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import BuyerLanding from '../../Pages/buyer/BuyerProfile'
// import Sellerlist from '../../Pages/Seller/Sellerlist'
// import Seller from '../../Pages/Seller/Seller'
// import Login from '../../Pages/Login/Login'
// import Signup from '../../Pages/signup/Signup'
// import Home from '../../Pages/Home/Home'

// import { useAppSelector } from '../../store/hooks'

jest.mock('../../store/hooks')

jest.mock('@uppy/core', () => {
  return jest.fn()
})
jest.mock('@uppy/xhr-upload', () => jest.fn())

describe('Navigation Component', () => {
  it('renders BuyerLanding', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/buyer']}>
        <BuyerLanding />
      </MemoryRouter>,
    )

    expect(container).toBeInTheDocument()
  })

  //   it('should render Seller', () => {
  //     const { container } = render(
  //       <MemoryRouter initialEntries={['/seller']}>
  //         <Seller />
  //       </MemoryRouter>,
  //     )
  //     expect(container).toBeInTheDocument()
  //   })

  //   it('should render Sellerlist', () => {
  //     const { container } = render(
  //       <MemoryRouter initialEntries={['/seller']}>
  //         <Sellerlist />
  //       </MemoryRouter>,
  //     )
  //     expect(container).toBeInTheDocument()
  //   })

  //   it('should render Login', () => {
  //     const { container } = render(
  //       <MemoryRouter initialEntries={['/seller']}>
  //         <Login />
  //       </MemoryRouter>,
  //     )
  //     expect(container).toBeInTheDocument()
  //   })

  //   it('should render Signup', () => {
  //     const { container } = render(
  //       <MemoryRouter initialEntries={['/seller']}>
  //         <Signup />
  //       </MemoryRouter>,
  //     )
  //     expect(container).toBeInTheDocument()
  //   })

  //   it('should render Home', () => {
  //     const { container } = render(
  //       <MemoryRouter initialEntries={['/seller']}>
  //         <Home />
  //       </MemoryRouter>,
  //     )
  //     expect(container).toBeInTheDocument()
  //   })
})
