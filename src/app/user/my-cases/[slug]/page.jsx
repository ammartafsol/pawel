import MyCaseDetailTemplate from '@/components/Template/User/MyCaseDetailTemplate/MyCaseDetailTemplate'
import React from 'react'

const page = async({params}) => {
    const {slug} = await params;
  return <MyCaseDetailTemplate slug={slug} />
}

export default page