


"use client";
import React, { useState, useEffect } from "react";
import classes from "./DashboardTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import CalenderHeaderDrop from "@/components/atoms/TableHeaderDrop/CalenderHeaderDrop";
import ActionCard from "@/components/molecules/ActionCard/ActionCard";
import { newCasesData } from "@/developementContent/Data/data";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import { caseStatusFilters, reactActivities } from "@/developementContent/Enums/enum";
import { useRouter } from "next/navigation";
import CreateNewCaseModal from "@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal";
import DropDown from "@/components/molecules/DropDown/DropDown";
import useAxios from "@/interceptor/axios-functions";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import moment from "moment";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";

const DashboardTemplate = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(
    caseStatusFilters[0]
  );
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [loading, setLoading] = useState("");
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const router = useRouter();
  const { Get } = useAxios();

  const handleDropdownChange = (value) => {
    setSelectedDropdownValue(value);
  };

  // Calculate date range based on current view and date
  const getDateRange = (view, date) => {
    const currentMoment = moment(date);
    let startDate, endDate;

    if (view === "day") {
      // For day view: startTime 12:00 AM (00:00:00) and endTime 11:59 PM (23:59:59)
      startDate = currentMoment.clone().startOf("day").toDate();
      endDate = currentMoment.clone().endOf("day").toDate();
    } else {
      // month view
      startDate = currentMoment.startOf("month").toDate();
      endDate = currentMoment.endOf("month").toDate();
    }

    return {
      startDate: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
    };
  };

  const getDashboardData = async () => {
    setLoading('loading');
    const { response } = await Get({ 
      route: `users/dashboard`,
      showAlert: false,
    });
    if (response) {
      setDashboardData(response?.data);
      const transformed = (response?.data?.recentActivities || []).map(transformActivityData);
      setRecentActivities(transformed);
      const events = transformAuditTrackingToEvents(response?.data?.auditTracking || []);
      setCalendarEvents(events);
    }
    setLoading('');
  };

  const fetchCalendarData = async () => {
    setCalendarLoading(true);
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    });
    const { response } = await Get({
      route: `users/dashboard?${queryParams.toString()}`,
      showAlert: false,
    });
    if (response) {
      const events = transformAuditTrackingToEvents(response?.data?.auditTracking || []);
      setCalendarEvents(events);
    }
    setCalendarLoading(false);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCalendarNavigate = (date) => {
    setCurrentDate(date);
  };

  // Fetch calendar data when view or date changes
  useEffect(() => {
    if (currentView && currentDate) {
      fetchCalendarData();
    }
  }, [currentView, currentDate]);

  const transformActivityData = (activityData) => {
    return {
      id: activityData._id,
      client: activityData.client?.fullName || "Unknown Client",
      slug: activityData.slug,
      type: typeof activityData?.type === 'object' 
        ? activityData.type?.name 
        : "Unknown Type",
      trademarkName: activityData?.trademarkName || "Unknown TrademarkName",
      trademarkNumber: activityData?.trademarkNumber || "Unknown TrademarkNumber",
      internalDeadline: activityData?.deadlines?.[activityData?.deadlines?.length - 1]?.deadline || null,
      officeDeadline: activityData?.deadlines?.[activityData?.deadlines?.length - 1]?.officeActionDeadline || null,
    };
  };

  const transformAuditTrackingToEvents = (auditTracking) => {
    const events = [];
    
    auditTracking.forEach((caseData) => {
      const clientName = caseData.client?.fullName || "Unknown Client";
      
      // Create an event for each deadline
      if (caseData.deadlines && Array.isArray(caseData.deadlines)) {
        caseData.deadlines.forEach((deadline) => {
          if (deadline.deadline) {
            const deadlineDate = new Date(deadline.deadline);
            // Set start time to beginning of day
            const start = new Date(deadlineDate);
            start.setHours(0, 0, 0, 0);
            // Set end time to end of day
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
              }
            });
          }
        });
      }
    });
    
    return events;
  };


  useEffect(() => {
    getDashboardData();
    // Fetch initial calendar data with current month
    const { startDate, endDate } = getDateRange("month", new Date());
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    });
    const fetchInitialCalendar = async () => {
      setCalendarLoading(true);
      const { response } = await Get({
        route: `users/dashboard?${queryParams.toString()}`,
        showAlert: false,
      });
      if (response) {
        const events = transformAuditTrackingToEvents(response?.data?.auditTracking || []);
        setCalendarEvents(events);
      }
      setCalendarLoading(false);
    };
    fetchInitialCalendar();
  }, []);
  
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  if (loading === 'loading') {
    return <SpinnerLoading />;
  }

  return (
    <div>
    <div className={classes?.dashboardTemplateHeader}>
        <h4>{new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</h4>
        <p>{getGreeting()}, John Doe.</p>
      </div>
      <div className="p24">
        <Row>
          <Col lg={7}>
            <Wrapper
              contentClassName={classes?.calenderWrapper}
              headerComponent={<CalenderHeaderDrop />}
            >
              {calendarLoading ? (
                <LoadingSkeleton height="500px" />
              ) : (
                <Calender 
                  className={classes?.calender} 
                  events={calendarEvents}
                  view={currentView}
                  date={currentDate}
                  onView={handleViewChange}
                  onNavigate={handleCalendarNavigate}
                />
              )}
            </Wrapper>
          </Col>
          <Col lg={5}>
            <div className={classes?.newCases}>
              <Row className="g-4">
                {newCasesData.map((item) => (
                  <Col md={6} key={item.id}>
                    <ActionCard
                      {...item}
                      title={item.title}
                      image={item.image}
                      onClick={
                        item.title === "Create New Case"
                          ? () => setShowCreateNewCaseModal(true)
                          :
                          item.title === "Add a Document"
                          ?() => {
                              router.push("/document-management");
                            }:undefined
                      }
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Wrapper
              headerComponent={
                <TableHeader
                  viewButtonText="View All"
                  onClickViewAll={() => router.push("/case-management")}
                  title="Recent Activities"
                  dropdownOptions={caseStatusFilters}
                  dropdownPlaceholder="Select Activity"
                  selectedDropdownValue={selectedDropdownValue}
                  setSelectedDropdownValue={setSelectedDropdownValue}
                />
              }
              className={classes.wrapper}
              contentClassName={classes.contentClassName}
            >
              <ResponsiveTable
                tableHeader={staffDashboardTableHeader}
                data={recentActivities}
              />
             
            </Wrapper>
          </Col>
        </Row>
      </div>
      <CreateNewCaseModal
        show={showCreateNewCaseModal}
        setShow={setShowCreateNewCaseModal}
      />
    </div>
  );
};

export default DashboardTemplate;

