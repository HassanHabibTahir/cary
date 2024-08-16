import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { useEffect } from 'react'
import { checkIfInterestProfileCompleted, getInterestProfile } from '../../helper/CommonFunction'
import MainLayout from '../../Components/Layouts/MainLayout'

export default function BuyerProfile() {
  const userDetails = useAppSelector((state) => state.user)
  const isBuyer = userDetails?.userLoginInfo?.user_type?.toLowerCase() === 'buyer'
  const interestProfile = getInterestProfile(userDetails?.meData)
  const isInterestProfileCompleted = checkIfInterestProfileCompleted(isBuyer, userDetails, interestProfile)

  const navigate = useNavigate()

  useEffect(() => {
    if (isInterestProfileCompleted) {
      navigate('/buyer/listings')
    }
  }, [])

  return (
    <>
      <MainLayout hideLinks={true}>
        <Outlet />
      </MainLayout>
    </>
  )
}
