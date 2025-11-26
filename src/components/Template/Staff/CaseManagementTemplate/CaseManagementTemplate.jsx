"use client";
import React, { useState } from 'react';
import classes from "./CaseManagementTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
import { reactActivities } from '@/developementContent/Enums/enum';
import { FaRegFolderClosed } from "react-icons/fa6";

const CaseManagementTemplate = () => {
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(reactActivities[0]);
  return (
    <div className='p24'>
      <Wrapper  headerComponent={<TableHeader viewButtonText='Create new case'  dropdownOptions={reactActivities}  selectedDropdownValue={selectedDropdownValue} setSelectedDropdownValue={setSelectedDropdownValue} title="Case Management" titleIcon={<FaRegFolderClosed color='#D9D9D9' size={20} />} />}>

      </Wrapper>
    </div>
  )
}

export default CaseManagementTemplate