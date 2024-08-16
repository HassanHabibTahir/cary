import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import { store } from '../../../store/store'
import Header from '../../Layouts/Header'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}))

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useDisclosure: jest.fn(() => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() })),
}))

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    )
  })

  it('displays the correct number of NavLinks', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    )
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
  })
})
