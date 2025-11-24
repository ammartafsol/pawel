import Header from '@/components/molecules/Header/Header'
import React from 'react'

const layout = ({children}) => {
  return (
    <>
        <Header />
        {children}
    </>
  )
}

export default layout