import { Outlet } from 'react-router-dom'
import LeftHome from './LeftHome'

// Shared layout for all authenticated pages.
// Renders the fixed LeftHome sidebar (desktop only) and outlets child page content.
const AppLayout = () => {
  return (
    <>
      <LeftHome />
      <Outlet />
    </>
  )
}

export default AppLayout
