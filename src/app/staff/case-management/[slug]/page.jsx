import CaseManagementDetailTemplate from '@/components/Template/Staff/CaseManagementDetailTemplate/CaseManagementDetailTemplate';
import React from 'react';


const page = async({params}) => {
    const {slug} = await params;
  return (
    <>
    <CaseManagementDetailTemplate slug={slug} />
    </>
  )
}

export default page