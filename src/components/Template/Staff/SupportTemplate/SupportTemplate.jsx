"use client";
import React, { useEffect, useState } from 'react';
import classes from "./SupportTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
import { supportManagementTableHeader } from '@/developementContent/TableHeader/SupportManagementTableHeader';
import { GoQuestion } from "react-icons/go";
import ResponsiveTable from '@/components/organisms/ResponsiveTable/ResponsiveTable';
import ReplySupportModal from "@/components/organisms/Modals/ReplySupportModal/ReplySupportModal";
import useAxios from '@/interceptor/axios-functions';
import { capitalizeFirstWord } from '@/resources/utils/helper';
import useDebounce from '@/resources/hooks/useDebounce';
import { RECORDS_LIMIT } from '@/resources/utils/constant';
import { RenderDateCell } from '@/components/organisms/ResponsiveTable/CommonCells';


const SupportTemplate = () => {
  const [loading, setLoading] = useState('');
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { Get } = useAxios();

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
      value: "",
      onClick: () => {
        setStatus("");
        setPage(1);
      }
    },
    {
      label: "Pending",
      value: "pending",
      onClick: () => {
        setStatus("pending");
        setPage(1);
      }
    },
    {
      label: "Active",
      value: "active",
      onClick: () => {
        setStatus("active");
        setPage(1);
      }
    },
    {
      label: "In-Active",
      value: "inactive",
      onClick: () => {
        setStatus("inactive");
        setPage(1);
      }
    }
  ];

  const getSupportData = async ({_status, _page}) => {
    setLoading('loading');
    const currentPage = _page !== undefined ? _page : page;
    const query = {
      search: debouncedSearch,
      page: currentPage,
      limit: RECORDS_LIMIT,
      status: _status !== undefined ? _status : status,
    };
    const queryString = new URLSearchParams(query).toString();
    const { response } = await Get({ route: `support/all?${queryString}` });
    if(response) {
      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
      if (_page !== undefined) {
        setPage(_page);
      }
    }
    setLoading('');
  };

  useEffect(() => {
    getSupportData({_status: status, _page: 1});
  }, [debouncedSearch, status]);

  const transformSupportData = (item) => {
    return {
      id: item?.user?.fullName,
      clientName: capitalizeFirstWord(item?.user?.fullName) || "Unknown Client",
      category: capitalizeFirstWord(item?.category?.name) || "Unknown Category",
      message: item?.message || "No message",
      status: item?.status || "Unknown",
      received: <RenderDateCell cellValue={item?.createdAt}  />|| null,
    };
  };

  const transformedData = data?.map(transformSupportData) || [];




  return (
    <div className='p24'>
      <Wrapper 
        headerComponent={
          <TableHeader 
            title="Support Management" 
            titleIcon={<GoQuestion color='#D9D9D9' size={20} />}
            searchValue={searchValue}
            onSearchChange={(value) => {
              setPage(1);
              setSearchValue(value);
            }}
            searchPlaceholder="Search..."
            onFilterClick={handleFilterClick}
            filterOptions={filterOptions}
          />
        }
        contentClassName={classes.contentClassName}
      >
        <ResponsiveTable
          tableHeader={supportManagementTableHeader(handlePendingClick)}
          data={transformedData}
          loading={loading === 'loading'}
          pagination={true}
          page={page}
          totalRecords={totalRecords}
          onPageChange={(newPage) => {
            getSupportData({_status: status, _page: newPage});
          }}
        />
      </Wrapper>
      <ReplySupportModal 
        show={showReplyModal} 
        getSupportData={getSupportData}
        setShow={setShowReplyModal}
        clientName={selectedClientName}
      />
    </div>
  )
}
export default SupportTemplate