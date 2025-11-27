"use client";
import Button from "@/components/atoms/Button";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import React, { useState, useRef, useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import classes from "./CaseManagementDetailTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import EvidenceTableTop from "@/components/molecules/EvidenceTableTop/EvidenceTableTop";
import {
  auditTrackingOptions,
  caseDetailTabs,
} from "@/developementContent/Enums/enum";
import Calender from "@/components/molecules/Calender/Calender";
import { myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import TabFilter from "@/components/molecules/TabFilter/TabFilter";
import Notes from "@/components/molecules/Notes/Notes";
import ActivityLog from "@/components/molecules/ActivityLog/ActivityLog";
import DocCard from "@/components/atoms/DocCard/DocCard";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import { BiFilterAlt } from "react-icons/bi";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import { useRouter } from "next/navigation";
import { MdAddCircle } from "react-icons/md";

const CaseManagementDetailTemplate = ({ slug }) => {
    const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(auditTrackingOptions[0]);
  const [activeTab, setActiveTab] = useState(caseDetailTabs[0].value);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
  const fileInputRef = useRef(null);
  const filterRef = useRef(null);

  const router =useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOverlayOpen(false);
      }
    };

    if (isFilterOverlayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOverlayOpen]);

  const handleFilterIconClick = () => {
    setIsFilterOverlayOpen(!isFilterOverlayOpen);
  };

  const handleFilterOptionClick = (onClick) => {
    onClick();
    setIsFilterOverlayOpen(false);
  };

  const filterOptions = [
    {
      label: "All",
      onClick: () => {
        console.log("Filter: All");
      }
    },
    {
      label: "Latest",
      onClick: () => {
        console.log("Filter: Latest");
      }
    },
  ];

  const handleUploadDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      // Handle file selection here
      console.log("Selected files:", selectedFiles);
      // You can add your file upload logic here
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const documents = [
    {
      id: "document-1",
      title: "Document 1",
      dateTime: "12/29/2023 10:20",
      visibilityText: "Visible to client",
    },
    {
      id: "document-2",
      title: "Document 2",
      dateTime: "12/29/2023 10:20",
      visibilityText: null,
    },
    {
      id: "document-3",
      title: "Document 3",
      dateTime: "12/29/2023 10:20",
      visibilityText: null,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className={classes.notesContainer}>
            <Notes 
              showAddNoteModal={showAddNoteModal} 
              setShowAddNoteModal={setShowAddNoteModal}
              searchValue={searchValue} 
              setSearchValue={setSearchValue} 
            />
          </div>
        );
      case "activityLog":
        return (
          <div className={classes.activityLogContainer}>
            <div className={classes.headingDiv}>
              <h5>Recent activities</h5>
            </div>
            <div className={classes.activityListContainer}>
              <ActivityLog
                activities={[
                  { text: "Status update to Defense", date: "May 1, 2025" },
                  {
                    text: "Status update to Evidence Round Opponent",
                    date: "May 15, 2025",
                  },
                  { text: "Document Upload", date: "May 15, 2025" },
                  { text: "Status update to Hearing", date: "May 17, 2025" },
                  { text: "Document Upload", date: "May 18, 2025" },
                ]}
              />
            </div>
          </div>
        );
      case "documents":
        return (
          <div className={classes.activityLogContainer}>
            <div className={classes.headingDivDoc}>
              <h5>Case documents</h5>
              <div className={classes.docsHeaderRight}>
                {/* Temporarily open file browsing: */}
                <Button 
                  label="Upload Document" 
                  className={classes.uploadDocumentButton} 
                  leftIcon={<MdAddCircle color="var(--white)" size={20} />}
                  onClick={handleUploadDocument}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                />
                <SearchInput />
                <div className={classes.filterWrapper} ref={filterRef}>
                  <div 
                    className={`${classes.filterIcon} ${isFilterOverlayOpen ? classes.filterIconActive : ""}`} 
                    onClick={handleFilterIconClick}
                  >
                    <BiFilterAlt size={20} color="var(--black)" />
                  </div>
                  {isFilterOverlayOpen && filterOptions.length > 0 && (
                    <div className={classes.filterOverlay}>
                      {filterOptions.map((option, index) => (
                        <div
                          key={index}
                          className={classes.filterOption}
                          onClick={() => handleFilterOptionClick(option.onClick || (() => {}))}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={classes.docListContainer}>
              {documents.map((doc) => (
                <DocCard
                  key={doc.id}
                  title={doc.title}
                  dateTime={doc.dateTime}
                  visibilityText={doc.visibilityText}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p24">
      <Wrapper
        contentClassName={classes.contentClassName}
        headerComponent={
          <div className={classes.backButtonContainer}>
            <Button
              className={classes.backButton}
              variant="outlined"
              leftIcon={<IoChevronBack color="#151529" />}
              label="Back"
              onClick={() => router.back()}
            />
          </div>
        }
      >
        <div className={classes?.content}>
          <Row>
            <Col md={3}>
              <CaseProgressCard
                data={{
                  tabLabel: "EU TM OPPO",
                  userName: "Assigned Staff",
                  progress: 80,
                  status: "Decision",
                  trademarkName: "A and Sons",
                  trademarkNo: "R-3526",
                  referenceLink: "#",
                  primaryStaff: "Roxanne Gleichner",
                  secondaryStaff: "Roxanne Gleichner",
                  jurisdiction: "EUIPO",
                  clientName: "Dana Auer",
                  deadlines: [
                    { label: "Defense", value: "Nov 20, 25" },
                    { label: "Second Observations", value: "Dec 20, 25" },
                    { label: "Decision", value: "Jan 20, 26" },
                  ],
                  tasks: ['Evidence Round Opponent']
                }}
                // isAssignedStaffVariant
                isCaseDetailVariant
              />
            </Col>
            <Col md={9}>
              <Wrapper
                headerComponent={
                  <EvidenceTableTop
                    title="Audit Tracking"
                    placeholder="Select..."
                    selectedValue={selectedValue}
                    options={auditTrackingOptions}
                    setSelectedValue={setSelectedValue}
                  />
                }
              >
                <Calender events={myEventsList} />
              </Wrapper>

              <Wrapper
                contentClassName={classes?.contentClassName}
                headerComponent={
                  <TabFilter
                    tabs={caseDetailTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                }
              >
                {renderTabContent()}
              </Wrapper>
            </Col>
          </Row>
        </div>
      </Wrapper>
    </div>
  );
};

export default CaseManagementDetailTemplate;
