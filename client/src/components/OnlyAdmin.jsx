import { useSelector } from "react-redux";
import { Outlet,Navigate } from "react-router-dom";

const OnlyAdmin = () => {
    const { currentUser } = useSelector(state => state.user)
  return currentUser.isAdmin ? <Outlet /> : <Navigate to='/login' />
}

export default OnlyAdmin
