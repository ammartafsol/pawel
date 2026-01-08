import UserManagementDetailTemplate from '@/components/Template/Staff/UserManagementDetailTemplate/UserManagementDetailTemplate'
import React from 'react'

const page = async({params}) => {
    const {slug} = await params;
  return (
    <>
    <UserManagementDetailTemplate slug={slug} />
    </>
  )
}

export default page