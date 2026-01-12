"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classes from "./MyCaseDetailTemplate.module.css";
import BreadComTop from "@/components/atoms/BreadComTop/BreadComTop";
import { Col, Row } from "react-bootstrap";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import Calender from "@/components/molecules/Calender/Calender";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TabFilter from "@/components/molecules/TabFilter/TabFilter";
import { caseDetailTabs } from "@/developementContent/Enums/enum";
import Notes from "@/components/molecules/Notes/Notes";
import ActivityLog from "@/components/molecules/ActivityLog/ActivityLog";
import DocCard from "@/components/atoms/DocCard/DocCard";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import { BiFilterAlt } from "react-icons/bi";
import useAxios from "@/interceptor/axios-functions";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import NotFound from "@/components/atoms/NotFound/NotFound";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import moment from "moment";

const MyCaseDetailTemplate = ({ slug }) => {
  const [activeTab, setActiveTab] = useState(caseDetailTabs[0].value);
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const { Get } = useAxios();

  // Get date range based on view and date (reference: Staff DashboardTemplate)
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

  // Transform calendar events from case details deadlines (reference: User DashboardTemplate)
  const transformDeadlinesToEvents = (caseData) => {
    if (!caseData || !caseData.deadlines || !Array.isArray(caseData.deadlines)) return [];
    
    const events = [];
    const clientName = caseData.client?.fullName || caseData.trademarkName || "Case";
    
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
            caseId: caseData._id,
            slug: caseData.slug,
            deadlineStatus: deadline.deadlineStatus,
            deadline: deadline.deadline,
            officeActionDeadline: deadline.officeActionDeadline,
          },
        });
      }
    });
    
    return events;
  };

  // Fetch calendar data based on date range - using same case/detail API with query params
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

  // Fetch case details (reference: Staff CaseManagementDetailTemplate)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Fetch initial calendar data on mount (reference: User DashboardTemplate)
  useEffect(() => {
    if (!slug) return;
    const { startDate, endDate } = getDateRange("month", new Date());
    const queryParams = new URLSearchParams({ startDate, endDate });
    const fetchInitialCalendar = async () => {
      setCalendarLoading(true);
        const { response } = await Get({
          route: `case/detail/${slug}?${queryParams.toString()}`,
          showAlert: false,
        });
        if (response?.status === "success" && response.data) {
          const events = transformDeadlinesToEvents(response.data);
          setCalendarEvents(events);
        }
        setCalendarLoading(false);
    };
    fetchInitialCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Fetch calendar data when view or date changes (reference: User DashboardTemplate)
  useEffect(() => {
    if (!slug) return;
    fetchCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, currentDate]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("calendarEvents",calendarEvents);

  // Format date for deadline display
  const formatDeadlineDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  // Transform deadlines for CaseProgressCard
  const transformDeadlines = (deadlines = []) => {
    return deadlines.map((deadline, index) => ({
      label: deadline.deadlineStatus || `Deadline ${index + 1}`,
      value: formatDeadlineDate(deadline.deadline),
    }));
  };

  // Transform case data for CaseProgressCard (client view)
  const transformCaseData = () => {
    if (!caseDetails) return null;

    return {
      tabLabel: caseDetails.status || "Case",
      userName: caseDetails.primaryStaff?.fullName || "Unassigned",
      progress:
        caseDetails.deadlines?.length > 0
          ? Math.round(
              (caseDetails.deadlines.filter(
                (d) => new Date(d.deadline) < new Date()
              ).length / caseDetails.deadlines.length) *
                100
            )
          : 0,
      status: caseDetails.status || "Pending",
      trademarkName: caseDetails.trademarkName || "",
      trademarkNo: caseDetails.trademarkNumber || "",
      referenceLink: "#",
      jurisdiction:
        typeof caseDetails.jurisdiction === "object"
          ? caseDetails.jurisdiction?.name ||
            caseDetails.jurisdiction?.code ||
            ""
          : caseDetails.jurisdiction || "",
      clientName: caseDetails.client?.fullName || "Unknown Client",
      deadlines: transformDeadlines(caseDetails.deadlines),
      tasks:
        caseDetails.deadlines
          ?.map((d) => d.deadlineStatus)
          .filter(Boolean) || [],
      officeDeadline:
        caseDetails.deadlines?.[0]?.officeActionDeadline
          ? new Date(
              caseDetails.deadlines[0].officeActionDeadline
            )
              .toISOString()
              .split("T")[0]
          : "",
      internalDeadline:
        caseDetails.deadlines?.[0]?.deadline
          ? new Date(caseDetails.deadlines[0].deadline)
              .toISOString()
              .split("T")[0]
          : "",
      reference: {
        referenceName: "Reference",
        link: "#",
        refrenece: [],
      },
    };
  };

  // Transform documents from API
  const documents =
    caseDetails?.caseDocuments?.map((doc) => ({
      id: doc._id,
      title: doc.fileName || "Document",
      dateTime: formatDate(doc.createdAt),
      visibilityText: doc.permissions?.includes("visible-to-client")
        ? "Visible to client"
        : null,
    })) || [];

  // Transform activity logs from API
  const activities =
    caseDetails?.activityLogs?.map((log) => ({
      text: log.description || log.type,
      date: formatDate(log.createdAt),
    })) || [];

  // Transform case notes from API (read-only for now)
  const caseNotes = caseDetails?.caseNotes || [];

  const renderTabContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className={classes.notesContainer}>
            {caseNotes.length > 0 ? (
              <Notes caseNotes={caseNotes} readOnly />
            ) : (
              <NoDataFound text="No notes found" />
            )}
          </div>
        );
      case "activityLog":
        return (
          <div className={classes.activityLogContainer}>
            <div className={classes.headingDiv}>
              <h5>Recent activities</h5>
            </div>
            <div className={classes.activityListContainer}>
              {activities.length > 0 ? (
                <ActivityLog activities={activities} />
              ) : (
                <NoDataFound text="No activities found" />
              )}
            </div>
          </div>
        );
      case "documents":
        return (
          <div className={classes.activityLogContainer}>
            <div className={classes.headingDivDoc}>
              <h5>Case documents</h5>
              <div className={classes.docsHeaderRight}>
                <SearchInput
                  value={searchValue}
                  setValue={setSearchValue}
                  placeholder="Search documents"
                />
                <div className={classes.filterIcon}>
                  <BiFilterAlt size={20} color="var(--black)" />
                </div>
              </div>
            </div>
            <div className={classes.docListContainer}>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <DocCard
                    key={doc.id}
                    title={doc.title}
                    dateTime={doc.dateTime}
                    visibilityText={doc.visibilityText}
                  />
                ))
              ) : (
                <NoDataFound text="No documents found" />
              )}
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
    return <NotFound message="Case not found" />;
  }

  const caseData = transformCaseData();

  return (
    <div className="p24">
      <BreadComTop />
      <div className={classes.content}>
        <Row>
          <Col md={4}>
            {caseData && (
              <CaseProgressCard
                data={caseData}
                isCaseDetailVariant
                showReference={true}
              />
            )}
          </Col>
          <Col md={8}>
            <Wrapper
              contentClassName={classes?.contentClassName}
              title="Recent Case Statuses"
            >
              {calendarLoading ? (
                <LoadingSkeleton height="500px" />
              ) : (
                <Calender
                  events={calendarEvents}
                  className={classes.calender}
                  view={currentView}
                  date={currentDate}
                  onView={setCurrentView}
                  onNavigate={setCurrentDate}
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
    </div>
  );
};

MyCaseDetailTemplate.propTypes = {
  slug: PropTypes.string,
};

export default MyCaseDetailTemplate;
