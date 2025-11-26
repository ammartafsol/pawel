import StaffLayout from '@/components/atoms/StaffLayout/StaffLayout'
import React from 'react'

const layout = ({children}) => {
  return (
    <StaffLayout>
        {children}
    </StaffLayout>
  )
}

export default layout