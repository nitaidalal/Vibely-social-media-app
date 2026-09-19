import React from 'react'
import Feed from '../components/Feed'
import RightHome from '../components/RightHome'
import usePageTitle from '../hooks/usePageTitle'

const Home = () => {
  usePageTitle('Home - Vibely')

  return (
    <div>
      <Feed />
      <RightHome />
    </div>
  )
}

export default Home
