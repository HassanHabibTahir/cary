import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Layouts/Header'

const PublicNavigation: React.FC = () => {
  return (
    <div>
      <Outlet context={{ Header }} />
    </div>
  )
}

export default PublicNavigation
