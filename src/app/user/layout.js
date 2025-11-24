import UserLayout from '@/components/atoms/UserLayout/UserLayout'
import React from 'react'

const layout = ({children}) => {
  return (
    <>
    <UserLayout>
      {children}
    </UserLayout>
    </>
  )
}

export default layout