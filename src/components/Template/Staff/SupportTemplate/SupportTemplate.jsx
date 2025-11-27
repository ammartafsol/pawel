"use client";
import React, { useState } from 'react';
import classes from "./SupportTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
import AppTable from '@/components/organisms/AppTable/AppTable';
import { supportManagementTableHeader } from '@/developementContent/TableHeader/SupportManagementTableHeader';
import { supportManagementTableBody } from '@/developementContent/TableBody/SupportManagementTableBody';
import { GoQuestion } from "react-icons/go";
import ResponsiveTable from '@/components/organisms/ResponsiveTable/ResponsiveTable';
import ReplySupportModal from "@/components/organisms/Modals/ReplySupportModal/ReplySupportModal";


const SupportTemplate = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("");

  const handlePendingClick = (rowData) => {
    setSelectedClientName(rowData?.clientName || "");
    setShowReplyModal(true);
  };

  const handleFilterClick = () => {
    // Filter functionality can be implemented here
    console.log("Filter clicked");
  };

  const filterOptions = [
    {
      label: "All",
      onClick: () => {
        console.log("Filter: All");
      }
    },
    {
      label: "Pending",
      onClick: () => {
        console.log("Filter: Pending");
      }
    },
    {
      label: "Active",
      onClick: () => {
        console.log("Filter: Active");
      }
    },
    {
      label: "In-Active",
      onClick: () => {
        console.log("Filter: In-Active");
      }
    }
  ];

  return (
    <div className='p24'>
      <Wrapper 
        headerComponent={
          <TableHeader 
            title="Support Management" 
            titleIcon={<GoQuestion color='#D9D9D9' size={20} />}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search..."
            onFilterClick={handleFilterClick}
            filterOptions={filterOptions}
          />
        }
        contentClassName={classes.contentClassName}
      >
        <ResponsiveTable
          tableHeader={supportManagementTableHeader(handlePendingClick)}
          data={supportManagementTableBody}
        />
      </Wrapper>
      <ReplySupportModal 
        show={showReplyModal} 
        setShow={setShowReplyModal}
        clientName={selectedClientName}
      />
    </div>
  )
}
export default SupportTemplate