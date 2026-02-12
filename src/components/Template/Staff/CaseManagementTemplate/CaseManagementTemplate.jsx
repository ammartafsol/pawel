"use client";
import React, { useState, useEffect } from 'react';
import classes from "./CaseManagementTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
// import { caseStatusFilters } from '@/developementContent/Enums/enum';
import { FaRegFolderClosed } from "react-icons/fa6";
import CaseProgressCard from '@/components/molecules/CaseProgressCard/CaseProgressCard';
import { Col, Row } from "react-bootstrap";
import CreateNewCaseModal from '@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal';
import AreYouSureModal from '@/components/organisms/Modals/AreYouSureModal/AreYouSureModal';
import useDebounce from '@/resources/hooks/useDebounce';
import useAxios from '@/interceptor/axios-functions';
import { RECORDS_LIMIT } from '@/resources/utils/constant';
import Pagination from '@/components/molecules/Pagination/Pagination';
import NoDataFound from '@/components/atoms/NoDataFound/NoDataFound';
import { useSelector } from 'react-redux';
import SpinnerLoading from '@/components/atoms/SpinnerLoading/SpinnerLoading';
import { calculateProgress } from '@/resources/utils/caseHelper';

const CaseManagementTemplate = () => {
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [showUpdateDeadlineModal, setShowUpdateDeadlineModal] = useState(false);
  const [selectedCaseSlug, setSelectedCaseSlug] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [caseToDeleteSlug, setCaseToDeleteSlug] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Case type filters fetched from API (case-type/all)
  const [caseTypeFilters, setCaseTypeFilters] = useState([
    { label: 'All', value: 'all' },
  ]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState({
    label: 'All',
    value: 'all',
  });
  const {user} = useSelector((state) => state.authReducer);
  const [loading,setLoading] = useState('');
  const [page,setPage] = useState(1);
  const [totalRecords,setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [search,setSearch] = useState("");
  const debouceSearch = useDebounce(search, 500);
  const { Get, Delete } = useAxios();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  // Get next deadline
  const getNextDeadline = (deadlines = []) => {
    if (!deadlines || deadlines.length === 0) return "";
    const now = new Date();
    const upcomingDeadlines = deadlines
      .filter(d => new Date(d.deadline) >= now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    return upcomingDeadlines.length > 0 ? formatDate(upcomingDeadlines[0].deadline) : "";
  };

  // Transform API data to card format
  const transformCaseData = (caseData) => {
    // Find the phase that matches the case status
    const currentStatus = caseData.status || "";
    const matchingPhase = caseData.type?.phases?.find(
      (phase) => phase.name === currentStatus
    );

    return {
      id: caseData._id,
      slug: caseData.slug || caseData._id,
      tabLabel: caseData.status || "Case",
      userName: caseData.primaryStaff?.fullName || "Unassigned",
      progress: calculateProgress(caseData),
      status: caseData.status || "Pending",
      phaseBgColor: matchingPhase?.bgColor || null,
      phaseColor: matchingPhase?.color || null,
      trademarkName: caseData.trademarkName || "",
      trademarkNo: caseData.trademarkNumber || "",
      deadline: getNextDeadline(caseData.deadlines),
      clientName: caseData.client?.fullName || "Unknown Client"
    };
  };


  const getData = async (_page) => {
    setLoading('loading');
      const queryParams = new URLSearchParams({
        search: debouceSearch || "",
        page: (_page || page || 1).toString(),
        limit: RECORDS_LIMIT.toString(),
      });
      // Append selected case type as ?type= when not "all"
      if (selectedDropdownValue?.value && selectedDropdownValue.value !== "all") {
        queryParams.append("jurisdiction", selectedDropdownValue.value);
      }
      const { response } = await Get({ 
        route: `case/all?${queryParams.toString()}`,
        showAlert: false,
      });

      if (response) {
        setTotalRecords(response?.totalRecords || 0);
        const transformedData = response.data?.map(transformCaseData) || [];
        setData(transformedData);
      }
      setLoading('');

  };

  // Fetch case types for dropdown filter
  const fetchCaseTypes = async () => {
    const queryParams = new URLSearchParams({
      status: "active",
    }).toString();
      const { response } = await Get({
        route: `jurisdiction/all?${queryParams}`,
        showAlert: false,
      });

      const apiTypes = Array.isArray(response?.data) ? response.data : [];

      const dynamicFilters = apiTypes.map((type) => ({
        label: type.name || 'Unknown Type',
        value: type.slug || type._id,
      }));

      const allOption = { label: 'All', value: 'all' };
      setCaseTypeFilters([allOption, ...dynamicFilters]);

      // Ensure selected value is a valid option
      if (!selectedDropdownValue || selectedDropdownValue.value === undefined) {
        setSelectedDropdownValue(allOption);
      }
    
  };

  // Check user permissions
  const hasCreateCasePermission = user?.permissions?.includes('create-case') || false;
  const hasUpdateCasePermission = user?.permissions?.includes('update-case') || false;
  const hasDeleteCasePermission = user?.permissions?.includes('delete-case') || hasUpdateCasePermission;

  useEffect(() => {
    fetchCaseTypes();
  }, []);

  useEffect(() => {
    getData(page);
  }, [debouceSearch, page, selectedDropdownValue]);

  const handleEditClick = (caseSlug) => {
    setSelectedCaseSlug(caseSlug);
    setShowUpdateDeadlineModal(true);
  };

  const handleDeleteClick = (slug) => {
    setCaseToDeleteSlug(slug);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!caseToDeleteSlug) return;
    setIsDeleting(true);
      const { response } = await Delete({
        route: `case/delete-by-staff/${caseToDeleteSlug}`,
        showAlert: true,
      });
      if (response) {
        setShowDeleteModal(false);
        setCaseToDeleteSlug(null);
        getData(page);
      }
      setIsDeleting(false);
  };

  if(loading === 'loading'){
    return <SpinnerLoading />
  }

  return (
    <div className='p24'>
      <Wrapper
        headerComponent={
          <TableHeader
            viewButtonText='Create new case'
            searchValue={search}
            onSearchChange={setSearch}
            onClickViewAll={() => setShowCreateNewCaseModal(true)}
            disabled={!hasCreateCasePermission}
            dropdownOptions={caseTypeFilters}
            selectedDropdownValue={selectedDropdownValue}
            setSelectedDropdownValue={setSelectedDropdownValue}
            title="Case Management"
            titleIcon={<FaRegFolderClosed color='#D9D9D9' size={20} />}
          />
        }
      >
      <div className={classes.caseManagementCards}>
         {
          data?.length> 0 ?(
           <Row className="g-4">
           {data.map((item) => (
             <Col className="col-12 col-md-6  col-xl-4" key={item.id}>
               <CaseProgressCard 
                 isStatusVariant
                 routePath={`/staff/case-management/${item.slug}`}
                 showEditButton={hasUpdateCasePermission}
                 onEditClick={() => handleEditClick(item.slug)}
                 showDeleteButton={hasDeleteCasePermission}
                 onDeleteClick={() => handleDeleteClick(item.slug)}
                 data={{
                   tabLabel: item.tabLabel,
                   userName: item.userName,
                   progress: item.progress,
                   status: item.status,
                   phaseBgColor: item.phaseBgColor,
                   phaseColor: item.phaseColor,
                   trademarkName: item.trademarkName,
                   trademarkNo: item.trademarkNo,
                   deadline: item.deadline,
                   clientName: item.clientName
                 }}
               />
             </Col>
           ))}
         </Row>):
         <NoDataFound text="No cases found" />
         }
          {
            totalRecords > RECORDS_LIMIT && (
              <Pagination
              
              currentPage={page}
              totalTextLabel={`${totalRecords > 1 ? "Cases" : "Case"}`}
              totalRecords={totalRecords}
              limit={RECORDS_LIMIT}
              onPageChange={(e) => {
                setPage(e);
              }}
               />
              
            )
          }
        </div>
      </Wrapper>
      <CreateNewCaseModal 
        show={showCreateNewCaseModal} 
        setShow={setShowCreateNewCaseModal}
        onCaseCreated={() => {
          getData(page);
        }}
      />
      <CreateNewCaseModal 
        show={showUpdateDeadlineModal} 
        setShow={setShowUpdateDeadlineModal}
        caseSlug={selectedCaseSlug}
        isUpdateMode={true}
        onCaseCreated={() => {
          getData(page);
          setSelectedCaseSlug(null);
        }}
      />
      <AreYouSureModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        title="Delete case"
        subTitle="Are you sure you want to delete this case? This action cannot be undone."
        buttonLabel="DELETE"
        type="danger"
        isLoading={isDeleting}
        onClick={handleConfirmDelete}
      />
    </div>
  )
}

export default CaseManagementTemplate