"use client";
import React, { useState, useMemo } from 'react';
import classes from "./CaseManagementTemplate.module.css"
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import TableHeader from '@/components/molecules/TableHeader/TableHeader';
import { caseStatusFilters } from '@/developementContent/Enums/enum';
import { FaRegFolderClosed } from "react-icons/fa6";
import CaseProgressCard from '@/components/molecules/CaseProgressCard/CaseProgressCard';
import { Col, Row } from "react-bootstrap";
import { caseManagementCardsData } from '@/developementContent/Data/dummtData/dummyData';
import CreateNewCaseModal from '@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal';
import useDebounce from '@/resources/hooks/useDebounce';


const CaseManagementTemplate = () => {
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(caseStatusFilters[0]);
  const [search,setSearch] = useState("");
  const debouceSearch = useDebounce(search, 500);

  // Filter cases based on selected status
  const filteredCases = useMemo(() => {
    let filtered = caseManagementCardsData;

    // Filter by status
    if (selectedDropdownValue?.value && selectedDropdownValue.value !== "all") {
      filtered = filtered.filter(item => item.status === selectedDropdownValue.value);
    }

    // Filter by search term
    if (debouceSearch) {
      const searchLower = debouceSearch.toLowerCase();
      filtered = filtered.filter(item => 
        item.clientName?.toLowerCase().includes(searchLower) ||
        item.trademarkName?.toLowerCase().includes(searchLower) ||
        item.trademarkNo?.toLowerCase().includes(searchLower) ||
        item.status?.toLowerCase().includes(searchLower) ||
        item.tabLabel?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [selectedDropdownValue, debouceSearch]);

  return (
    <div className='p24'>
      <Wrapper   headerComponent={<TableHeader viewButtonText='Create new case' searchValue={search} onSearchChange={setSearch} onClickViewAll={() => setShowCreateNewCaseModal(true)}  dropdownOptions={caseStatusFilters}  selectedDropdownValue={selectedDropdownValue} setSelectedDropdownValue={setSelectedDropdownValue} title="Case Management" titleIcon={<FaRegFolderClosed color='#D9D9D9' size={20} />} />}>
      <div className={classes.caseManagementCards}>
        <Row className="g-4">
          {filteredCases.map((item) => (
            <Col className="col-12 col-md-4" key={item.id}>
              <CaseProgressCard 
                isStatusVariant
                routePath={`/staff/case-management/${item.id}`}
                data={{
                  tabLabel: item.tabLabel,
                  userName: item.userName,
                  progress: item.progress,
                  status: item.status,
                  trademarkName: item.trademarkName,
                  trademarkNo: item.trademarkNo,
                  deadline: item.deadline,
                  clientName: item.clientName
                }}
              />
            </Col>
          ))}
        </Row>
      </div>
      </Wrapper>
      <CreateNewCaseModal show={showCreateNewCaseModal} setShow={setShowCreateNewCaseModal} />
    </div>
  )
}

export default CaseManagementTemplate