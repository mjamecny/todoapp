import { Box } from '@chakra-ui/react'

import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SharedLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default SharedLayout
