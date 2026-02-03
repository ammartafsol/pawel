"use client";
import React, { useState, useEffect, useMemo } from "react";
import classes from "./DashboardTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender"; // Separate calendar component
import CalenderHeaderDrop from "@/components/atoms/TableHeaderDrop/CalenderHeaderDrop";
import ActionCard from "@/components/molecules/ActionCard/ActionCard";
import { newCasesData } from "@/developementContent/Data/data";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
// import { caseStatusFilters } from "@/developementContent/Enums/enum";
import { useRouter } from "next/navigation";
import CreateNewCaseModal from "@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import useAxios from "@/interceptor/axios-functions";
import moment from "moment";
import CalendarEventDetailModal from "@/components/organisms/Modals/CalendarEventDetailModal/CalendarEventDetailModal";
import { useSelector } from "react-redux";
import { capitalizeFirstWord } from "@/resources/utils/helper";

const DashboardTemplate = () => {
  // const [selectedDropdownValue, setSelectedDropdownValue] = useState(
  //   caseStatusFilters[0]
  // );
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  // Event Modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { Get } = useAxios();
  const router = useRouter();
  const { user } = useSelector((state) => state.authReducer);

  // Check user permissions
  const hasCreateCasePermission = user?.permissions?.includes('create-case') || false;
  const hasUpdateCasePermission = user?.permissions?.includes('update-case') || false;

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

  const getGreeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return "Good morning";
    if (currentHour >= 12 && currentHour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const getDashboardData = async () => {
    setLoading(true);
      const { response } = await Get({
        route: "users/dashboard",
        showAlert: false,
      });
      if (response) {
        setDashboardData(response?.data);
        setRecentActivities(
          (response?.data?.recentActivities || []).map(transformActivityData)
        );
      }
      setLoading(false);
    
  };

  const fetchCalendarData = async () => {
    setCalendarLoading(true);
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({ startDate, endDate });
      const { response } = await Get({
        route: `users/dashboard?${queryParams.toString()}`,
        showAlert: false,
      });
      if (response) {
        setCalendarEvents(
          transformAuditTrackingToEvents(response?.data?.auditTracking || [])
        );
      }
      setCalendarLoading(false);
    
  };

  const transformActivityData = (activityData) => ({
    id: activityData._id,
    client: activityData.client?.fullName || "Unknown Client",
    slug: activityData.slug,
    type:
      typeof activityData?.type === "object"
        ? activityData.type?.name
        : "Unknown Type",
    typeObject: activityData?.type || null, // Include full type object with phases
    status: activityData?.status || null, // Include status to match with phase
    trademarkName: activityData?.trademarkName || "Unknown TrademarkName",
    trademarkNumber: activityData?.trademarkNumber || "Unknown TrademarkNumber",
    internalDeadline:
      activityData?.deadlines?.[activityData?.deadlines?.length - 1]
        ?.deadline || null,
    officeDeadline:
      activityData?.deadlines?.[activityData?.deadlines?.length - 1]
        ?.officeActionDeadline || null,
  });

  const transformAuditTrackingToEvents = (auditTracking) => {
    return auditTracking
      .flatMap((caseData) => {
        const clientName = caseData.client?.fullName || "Unknown Client";
        const typeObject = caseData.type || null;

        return (caseData.deadlines || []).map((deadline) => {
          if (!deadline.deadline) return null;

          const deadlineDate = new Date(deadline.deadline);
          const start = new Date(deadlineDate).setHours(0, 0, 0, 0);
          const end = new Date(deadlineDate).setHours(23, 59, 59, 999);

          // Match the phase based on deadlineStatus
          const matchingPhase =
            typeObject?.phases?.find(
              (phase) => phase.name === deadline.deadlineStatus
            ) || null;

          return {
            start: new Date(start),
            end: new Date(end),
            title: clientName,
            resource: {
              caseId: caseData._id,
              slug: caseData.slug,
              deadlineStatus: deadline.deadlineStatus,
              deadline: deadline.deadline,
              typeName:
                typeof typeObject === "object" ? typeObject?.name : null,
              phaseName: deadline.deadlineStatus,
              phaseBgColor: matchingPhase?.bgColor || null,
              phaseColor: matchingPhase?.color || null,
            },
          };
        });
      })
      .filter(Boolean); // Remove null values
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    fetchCalendarData();
  }, [currentView, currentDate]);

  if (loading) return <SpinnerLoading />;

  return (
    <div>
      <div className={classes?.dashboardTemplateHeader}>
        <h4>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h4>
        <p>{getGreeting}, {capitalizeFirstWord(user?.fullName)}.</p>
      </div>
      <div className="p24">
        <Row>
          <Col lg={6} xl={7}>
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
                  onView={setCurrentView}
                  onNavigate={setCurrentDate}
                  onSelectEvent={handleEventClick}
                />
              )}
            </Wrapper>
          </Col>
          <Col lg={6} xl={5}>
            <div className={classes?.newCases}>
              <Row className="g-4">
                {newCasesData.map((item) => {
                  // Determine if this action card should be disabled based on permissions
                  let isDisabled = false;
                  if (item.title === "Create New Case") {
                    isDisabled = !hasCreateCasePermission;
                  } else if (item.title === "Add a Document") {
                    // Assuming document upload requires create-case permission
                    isDisabled = !hasCreateCasePermission;
                  }
                  // Export actions might not require specific permissions, but can be added if needed
                  
                  return (
                    <Col md={6} key={item.id}>
                      <ActionCard
                        {...item}
                        title={item.title}
                        image={item.image}
                        disabled={isDisabled}
                        onClick={
                          item.title === "Create New Case" && hasCreateCasePermission
                            ? () => setShowCreateNewCaseModal(true)
                            : item.title === "Add a Document" && hasCreateCasePermission
                            ? () => router.push("/staff/document-management")
                            : undefined
                        }
                      />
                    </Col>
                  );
                })}
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
                  hideDropdown={true}
                  hideSearch={true}
                  // dropdownOptions={caseStatusFilters}
                  // dropdownPlaceholder="Select Activity"
                  // selectedDropdownValue={selectedDropdownValue}
                  // setSelectedDropdownValue={setSelectedDropdownValue}
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
      <CalendarEventDetailModal
        show={showEventModal}
        setShow={setShowEventModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default DashboardTemplate;
