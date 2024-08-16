// import { useSelector } from "react-redux"
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isLogin)
  const isBuyer = useAppSelector((state) => state.user.user.isBuyer)

  if (!isAuthenticated && !isBuyer) {
    return (
      <Navigate
        to={'/'}
        replace
      />
    )
  }
  // if (isAuthenticated && isBuyer && isInterestProfileCompleted) {
  //   return (
  //     <Navigate
  //       to={'/buyer'}
  //       replace
  //     />
  //   )
  // }
  return <div>{children}</div>
}
export default ProtectedRoute
