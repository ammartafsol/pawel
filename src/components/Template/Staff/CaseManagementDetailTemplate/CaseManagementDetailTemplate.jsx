"use client";
import Button from "@/components/atoms/Button";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { IoChevronBack } from "react-icons/io5";
import classes from "./CaseManagementDetailTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import EvidenceTableTop from "@/components/molecules/EvidenceTableTop/EvidenceTableTop";
import {
  auditTrackingOptions,
  caseDetailTabs,
} from "@/developementContent/Enums/enum";
import Calender from "@/components/molecules/Calender/Calender";
import TabFilter from "@/components/molecules/TabFilter/TabFilter";
import Notes from "@/components/molecules/Notes/Notes";
import ActivityLog from "@/components/molecules/ActivityLog/ActivityLog";
import DocCard from "@/components/atoms/DocCard/DocCard";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import { BiFilterAlt } from "react-icons/bi";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import { useRouter } from "next/navigation";
import { MdAddCircle } from "react-icons/md";
import useAxios from "@/interceptor/axios-functions";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import NotFound from "@/components/atoms/NotFound/NotFound";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import moment from "moment";
import CalendarEventDetailModal from "@/components/organisms/Modals/CalendarEventDetailModal/CalendarEventDetailModal";
import { calculateProgress } from "@/resources/utils/caseHelper";

const CaseManagementDetailTemplate = ({ slug }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(auditTrackingOptions[0]);
  const [activeTab, setActiveTab] = useState(caseDetailTabs[0].value);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const fileInputRef = useRef(null);
  const filterRef = useRef(null);
  const isInitialMount = useRef(true);

  const router = useRouter();
  const { Get } = useAxios();

  // Get date range based on view and date (reference: MyCaseDetailTemplate)
  const getDateRange = (view, date) => {
    const currentMoment = moment(date);
    let startDate, endDate;

    if (view === "day") {
      startDate = currentMoment.clone().startOf("day").toDate();
      endDate = currentMoment.clone().endOf("day").toDate();
    } else {
      startDate = currentMoment.startOf("month").toDate();
      endDate = currentMoment.endOf("month").toDate();
    }

    return {
      startDate: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
    };
  };

  // Transform calendar events from case details deadlines (reference: MyCaseDetailTemplate)
  const transformDeadlinesToEvents = (caseData) => {
    if (!caseData || !caseData.deadlines || !Array.isArray(caseData.deadlines)) return [];
    
    const events = [];
    const clientName = caseData.client?.fullName || "Unknown Client";
    
    caseData.deadlines.forEach((deadline) => {
      if (deadline.deadline) {
        const deadlineDate = new Date(deadline.deadline);
        const start = new Date(deadlineDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(deadlineDate);
        end.setHours(23, 59, 59, 999);

        events.push({
          start: start,
          end: end,
          title: clientName,
          resource: {
            deadlineStatus: deadline.deadlineStatus,
            deadline: deadline.deadline,
            officeActionDeadline: deadline.officeActionDeadline,
          },
        });
      }
    });
    
    return events;
  };

  // Fetch calendar data based on date range (reference: MyCaseDetailTemplate)
  const fetchCalendarData = async () => {
    if (!slug) return;
    setCalendarLoading(true);
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({ startDate, endDate });

    try {
      const { response } = await Get({
        route: `case/detail/${slug}?${queryParams.toString()}`,
        showAlert: false,
      });
      if (response?.status === "success" && response.data) {
        // Transform calendar events from deadlines in the case details response
        const events = transformDeadlinesToEvents(response.data);
        setCalendarEvents(events);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Fetch case details
  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const { response } = await Get({
          route: `case/detail/${slug}`,
          showAlert: false,
        });

        if (response?.status === "success" && response.data) {
          setCaseDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching case details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [slug]);

  // Fetch initial calendar data on mount (reference: MyCaseDetailTemplate)
  useEffect(() => {
    if (!slug) return;
    const { startDate, endDate } = getDateRange("month", new Date());
    const queryParams = new URLSearchParams({ startDate, endDate });
    const fetchInitialCalendar = async () => {
      setCalendarLoading(true);
      try {
        const { response } = await Get({
          route: `case/detail/${slug}?${queryParams.toString()}`,
          showAlert: false,
        });
        if (response?.status === "success" && response.data) {
          const events = transformDeadlinesToEvents(response.data);
          setCalendarEvents(events);
        }
      } catch (error) {
        console.error("Error fetching initial calendar data:", error);
      } finally {
        setCalendarLoading(false);
      }
    };
    fetchInitialCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Fetch calendar data when view or date changes (reference: MyCaseDetailTemplate)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!slug) return;
    if (currentView && currentDate) {
      fetchCalendarData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, currentDate]);

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

  const handleFilterIconKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFilterIconClick();
    }
  };

  const handleFilterOptionClick = (onClick) => {
    onClick();
    setIsFilterOverlayOpen(false);
  };

  const handleFilterOptionKeyDown = (e, onClick) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFilterOptionClick(onClick);
    }
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for deadline display
  const formatDeadlineDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  // Transform deadlines for CaseProgressCard
  const transformDeadlines = (deadlines = []) => {
    return deadlines.map((deadline, index) => ({
      label: deadline.deadlineStatus || `Deadline ${index + 1}`,
      value: formatDeadlineDate(deadline.deadline),
    }));
  };

  // Transform case data for CaseProgressCard
  const transformCaseData = () => {
    if (!caseDetails) return null;

    return {
      tabLabel: caseDetails.status || "Case",
      userName: caseDetails.primaryStaff?.fullName || "Unassigned",
      progress: calculateProgress(caseDetails),
      status: caseDetails.status || "Pending",
      trademarkName: caseDetails.trademarkName || "",
      trademarkNo: caseDetails.trademarkNumber || "",
      referenceLink: "#",
      primaryStaff: caseDetails.primaryStaff?.fullName || "",
      secondaryStaff: caseDetails.secondaryStaff?.fullName || "",
      jurisdiction: typeof caseDetails.jurisdiction === 'object' 
        ? caseDetails.jurisdiction?.name || caseDetails.jurisdiction?.code || "" 
        : caseDetails.jurisdiction || "",
      clientName: caseDetails.client?.fullName || "Unknown Client",
      deadlines: transformDeadlines(caseDetails.deadlines),
      tasks: caseDetails.deadlines?.map(d => d.deadlineStatus).filter(Boolean) || [],
      officeDeadline: caseDetails.deadlines?.[0]?.officeActionDeadline 
        ? new Date(caseDetails.deadlines[0].officeActionDeadline).toISOString().split('T')[0]
        : "",
      internalDeadline: caseDetails.deadlines?.[0]?.deadline
        ? new Date(caseDetails.deadlines[0].deadline).toISOString().split('T')[0]
        : "",
      reference: {
        referenceName: "Reference",
        link: "#",
        refrenece: [],
      },
    };
  };

  // Transform documents from API
  const documents = caseDetails?.caseDocuments?.map((doc) => ({
    id: doc._id,
    title: doc.fileName || "Document",
    dateTime: formatDate(doc.createdAt),
    visibilityText: doc.permissions?.includes("visible-to-client") ? "Visible to client" : null,
  })) || [];


  // Transform activity logs from API
  const activities = caseDetails?.activityLogs?.map((log) => ({
    text: log.description || log.type,
    date: formatDate(log.createdAt),
  })) || [];

  // Transform case notes from API
  const caseNotes = caseDetails?.caseNotes || [];


  // Handle new note creation - update local state
  const handleNoteCreated = (newNote) => {
    console.log("newNote", newNote);
    if (caseDetails) {
      setCaseDetails({
        ...caseDetails,
        caseNotes: [newNote,...(caseDetails.caseNotes || [])]
      });
    }
  };

  // Handle calendar event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

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
              caseNotes={caseNotes}
              slug={slug}
              onNoteCreated={handleNoteCreated}
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
              <ActivityLog activities={activities} />
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
                    role="button"
                    tabIndex={0}
                    className={`${classes.filterIcon} ${isFilterOverlayOpen ? classes.filterIconActive : ""}`} 
                    onClick={handleFilterIconClick}
                    onKeyDown={handleFilterIconKeyDown}
                    aria-label="Filter options"
                  >
                    <BiFilterAlt size={20} color="var(--black)" />
                  </div>
                  {isFilterOverlayOpen && filterOptions.length > 0 && (
                    <div className={classes.filterOverlay}>
                      {filterOptions.map((option) => (
                        <div
                          key={option.label || `filter-${option.label}`}
                          role="button"
                          tabIndex={0}
                          className={classes.filterOption}
                          onClick={() => handleFilterOptionClick(option.onClick)}
                          onKeyDown={(e) => handleFilterOptionKeyDown(e, option.onClick)}
                          aria-label={`Filter by ${option.label}`}
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
              {documents.length > 0 ? documents.map((doc) => (
                <DocCard
                  key={doc.id}
                  title={doc.title}
                  dateTime={doc.dateTime}
                  visibilityText={doc.visibilityText}
                />
              ))
              :
              <NoDataFound className={classes?.Nodocument} text="No documents found" />
              }
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p24">
        <SpinnerLoading />
      </div>
    );
  }

  if (!caseDetails) {
    return (
    <NotFound message="Case not found" />
    );
  }

  const caseData = transformCaseData();

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
            <Col md={4}>
              {caseData && (
                <CaseProgressCard
                  data={caseData}
                  isCaseDetailVariant
                />
              )}
            </Col>
            <Col md={8}>
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
                {calendarLoading ? (
                  <LoadingSkeleton height="500px" />
                ) : (
                  <Calender 
                    events={calendarEvents}
                    view={currentView}
                    date={currentDate}
                    onView={setCurrentView}
                    onNavigate={setCurrentDate}
                    onSelectEvent={handleEventClick}
                  />
                )}
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
      <CalendarEventDetailModal
        show={showEventModal}
        setShow={setShowEventModal}
        event={selectedEvent}
        routePrefix="/staff/case-management"
      />
    </div>
  );
};

CaseManagementDetailTemplate.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default CaseManagementDetailTemplate;
