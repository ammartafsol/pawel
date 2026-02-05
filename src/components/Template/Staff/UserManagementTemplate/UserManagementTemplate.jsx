"use client";
import React, { useState, useEffect } from 'react';
import classes from "./UserManagementTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
import { userManagementTableHeader } from '@/developementContent/TableHeader/UserManagementTableHeader';
import { FaRegUser } from "react-icons/fa";
import ResponsiveTable from '@/components/organisms/ResponsiveTable/ResponsiveTable';
import useDebounce from '@/resources/hooks/useDebounce';
import useAxios from '@/interceptor/axios-functions';
import { RECORDS_LIMIT } from '@/resources/utils/constant';
import { capitalizeFirstWord } from '@/resources/utils/helper';
import { RenderDateCell } from '@/components/organisms/ResponsiveTable/CommonCells';

const UserManagementTemplate = () => {
  const [loading, setLoading] = useState('');
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { Get } = useAxios();

  const getUserData = async ({ _page } = {}) => {
    setLoading('loading');
    const currentPage = _page !== undefined ? _page : page;
    const query = {
      role: 'client',
      search: debouncedSearch || "",
      page: currentPage,
      limit: RECORDS_LIMIT,
    };
    const queryString = new URLSearchParams(query).toString();
    const { response } = await Get({ 
      route: `users?${queryString}`,
      showAlert: false,
    });
    if (response) {
      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
      if (_page !== undefined) {
        setPage(_page);
      }
    }
    setLoading('');
  };

  useEffect(() => {
    getUserData({ _page: 1 });
  }, [debouncedSearch]);

  const transformUserData = (item) => {
    const getStatusVariant = (status) => {
      if (status === 'active') return 'success';
      if (status === 'inactive') return 'inactiveStatus';
      return 'warning';
    };

    return {
      id: item?._id || item?.id,
      clientName: capitalizeFirstWord(item?.fullName) || "Unknown Client",
      email: item?.email || "No email",
      numberOfCases: item?.numberOfCases || item?.casesCount || 0,
      status: item?.status || "Unknown",
      statusVariant: getStatusVariant(item?.status),
      created: <RenderDateCell cellValue={item?.createdAt} /> || null,
      slug: item?.slug || "",
    };
  };

  const transformedData = data?.map(transformUserData) || [];

  return (
    <div className='p24'>
      <Wrapper 
        headerComponent={
          <TableHeader 
            title="User Management" 
            titleIcon={<FaRegUser color='#D9D9D9' size={20} />}
            searchValue={searchValue}
            onSearchChange={(value) => {
              setPage(1);
              setSearchValue(value);
            }}
            searchPlaceholder="Search..."
          />
        }
        contentClassName={classes.contentClassName}
      >
        <ResponsiveTable
          tableHeader={userManagementTableHeader}
          data={transformedData}
          loading={loading === 'loading'}
          pagination={true}
          totalTextLabel={`${totalRecords > 1 ? "Users" : "User"}`}
          page={page}
          totalRecords={totalRecords}
          onPageChange={(newPage) => {
            getUserData({ _page: newPage });
          }}
        />
      </Wrapper>
    </div>
  )
}

export default UserManagementTemplate