import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
// import Home from '../Pages/Home/Home'
import Login from '../Pages/Login/Login'
import Seller from '../Pages/Seller/Seller'
import BuyerProfile from '../Pages/buyer/BuyerProfile'
import Dashboard from '../Pages/buyer/Dashboard'
import ListingDetail from '../Pages/buyer/ListingDetail'
import Listings from '../Pages/buyer/Listings'
import Sellerlist from '../Pages/Seller/Sellerlist'
import Archived from '../Pages/buyer/component/Archived'
import Signup from '../Pages/signup/Signup'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import PublicNavigation from './PublicNavigation'
import Terms1 from '../Pages/buyer/component/Terms1'
import BuyerInfo from '../Pages/buyer/component/BuyerInfo'
import ProtectedRoute from '../Components/ProtectedRoute'
import { getMyData } from '../store/features/user/userAction'
import InterestProfileStepsWrapper from '../Pages/buyer/component/InterestProfileSteps/InterestProfileStepsWrapper'
import { checkIfInterestProfileCompleted, getInterestProfile, senitizePreferredLanguage } from '../helper/CommonFunction'
import TermsOfUse from '../Pages/TermsOfUse/TermsOfUse'
import PrivacyPolicy from '../Pages/PrivacyPolicy/PrivacyPolicy'
import ForgotPassword from '../Pages/ForgotPassword/ForgotPassword'
import { useTranslation } from 'react-i18next'
import VerifyPage from '../Pages/verify/VerifyPage'
import ResetPassword from '../Pages/resetPassword/Resetpassword'

const Navigation: React.FC = () => {

  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const userDetails = useAppSelector((state) => state.user);
  const token = userDetails?.userLoginInfo?.token || null;
  const meData = userDetails?.meData;
  const userType = meData?.user_type || null;
  const isBuyer = userType?.toLowerCase() === 'buyer' || false;
  const isSeller = userType?.toLowerCase() === 'seller' || false;
  const interestProfile = getInterestProfile(userDetails?.meData);
  const isInterestProfileCompleted = checkIfInterestProfileCompleted(isBuyer, userDetails, interestProfile);
  const isLoggedIn = !!token && !!meData?.id;
  const lang = senitizePreferredLanguage(userDetails?.meData?.preferred_language || 'en');

  const getRedirectUrl = () => {
    if (!meData) return null;

    if (isSeller) return '/seller';

    if (!token) return '/login';

    if (isBuyer) {
      const shouldRedirectToProfile = !isInterestProfileCompleted || !interestProfile?.mobile_phone_number;
      return shouldRedirectToProfile ? '/profile' : '/buyer/listings';
    }

    return '/profile';
  };

  useEffect(() => {
    try {
      if (!isLoggedIn) {
        const deviceLanguage = window.navigator.language;
        const lang = deviceLanguage.split('-')[0];
        i18n.changeLanguage(lang);
      } else {
        if (lang) {
          i18n.changeLanguage(lang);
        }
      }
    } catch (error) {
      console.log('error while changing the language', error);
    }
  }, [i18n, meData]);

  useEffect(() => {
    if (token) {
      dispatch(getMyData({ token: token }))
    }
  }, [token])

  const handleHomeRedirect = () => {
    if (isLoggedIn && isInterestProfileCompleted)
      return <Navigate to='/buyer/listings' />
    else if (isLoggedIn && !isInterestProfileCompleted)
      return <Navigate to='/profile' />
    else
      return <Navigate to="/signup" />
    // else
    //   return <Home />
  }

  return (
    <Routes>
      <Route
        path='/'
        element={<PublicNavigation />}
      >
        <Route
          index
          element={handleHomeRedirect()}
        />
        <Route
          path='buyer'
          element={
            <ProtectedRoute>
              {isInterestProfileCompleted ? <Dashboard /> : <Navigate replace to='/profile/vehicleinfo' />}
            </ProtectedRoute>
          }
        >
          <Route
            path='listings'
            element={<Listings />}
          />
          <Route
            path='listings/:id'
            element={<ListingDetail />}
          />
          <Route
            path='archive'
            element={<Archived />}
          />
          <Route
            path='info'
            element={<BuyerInfo />}
          />
        </Route>
        <Route
          path='profile'
          element={
            isInterestProfileCompleted ? (
              <Navigate to='/buyer/listings' />
            ) : (
              <ProtectedRoute>
                <BuyerProfile />
              </ProtectedRoute>
            )
          }
        >
          <Route
            index
            element={<Terms1 />}
          />
          <Route
            element={
              isInterestProfileCompleted ? (
                <Navigate to='/buyer/listings' />
              ) : (
                <InterestProfileStepsWrapper />
              )
            }
            path='vehicleinfo'
          />
        </Route>

        <Route
          path='seller'
          element={meData && !isBuyer ? <Sellerlist /> : <Navigate to='/' />}
        />

        <Route
          path='seller/add'
          element={<Seller />}
        />
        <Route
          path='live/:id'
          element={<Seller />}
        />

        <Route
          path='login'
          element={!meData ? <Login /> : <Navigate to={`${getRedirectUrl()}`} />}
        />
        <Route
          path='forgot-password'
          element={<ForgotPassword />}
        />
         <Route
          path='reset_password'
          element={<ResetPassword />}
        />

        <Route
          path='signup'
          element={!meData ? <Signup /> : <Navigate to={`${getRedirectUrl()}`} />}
        />
        <Route
          path='verify/:user_id/:email/:password/:user_type'
          element={<VerifyPage />}
        />
        <Route
          path='terms-of-use'
          element={<TermsOfUse />}
        />
        <Route
          path='privacy-policy'
          element={<PrivacyPolicy />}
        />
      </Route>
    </Routes>
  )
}

export default Navigation
