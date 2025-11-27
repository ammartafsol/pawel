"use client";
import React, { useState } from 'react';
import classes from "./UserManagementTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
import AppTable from '@/components/organisms/AppTable/AppTable';
import { userManagementTableHeader } from '@/developementContent/TableHeader/UserManagementTableHeader';
import { userManagementTableBody } from '@/developementContent/TableBody/UserManagementTableBody';
import { FaRegUser } from "react-icons/fa";
import ResponsiveTable from '@/components/organisms/ResponsiveTable/ResponsiveTable';

const UserManagementTemplate = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleFilterClick = () => {
    // Filter functionality can be implemented here
    console.log("Filter clicked");
  };

  const filterOptions = [
    {
      label: "All Users",
      onClick: () => {
        console.log("Filter: All Users");
      }
    },
    {
      label: "Active Users",
      onClick: () => {
        console.log("Filter: Active Users");
      }
    },
    {
      label: "Inactive Users",
      onClick: () => {
        console.log("Filter: Inactive Users");
      }
    },
    {
      label: "Pending Cases",
      onClick: () => {
        console.log("Filter: Pending Approval");
      }
    }
  ];

  return (
    <div className='p24'>
      <Wrapper 
        headerComponent={
          <TableHeader 
            title="User Management" 
            titleIcon={<FaRegUser color='#D9D9D9' size={20} />}
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
          tableHeader={userManagementTableHeader}
          data={userManagementTableBody}
        />
      </Wrapper>
    </div>
  )
}

export default UserManagementTemplate