
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
import { caseStatusFilters } from "@/developementContent/Enums/enum";
import { useRouter } from "next/navigation";
import CreateNewCaseModal from "@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import useAxios from "@/interceptor/axios-functions";
import moment from "moment";

const DashboardTemplate = () => {
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(caseStatusFilters[0]);
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  const { Get } = useAxios();
  const router = useRouter();



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
    try {
      const { response } = await Get({ route: "users/dashboard", showAlert: false });
      if (response) {
        setDashboardData(response?.data);
        setRecentActivities((response?.data?.recentActivities || []).map(transformActivityData));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  const fetchCalendarData = async () => {
    setCalendarLoading(true);
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({ startDate, endDate });

    try {
      const { response } = await Get({ route: `users/dashboard?${queryParams.toString()}`, showAlert: false });
      if (response) {
        setCalendarEvents(transformAuditTrackingToEvents(response?.data?.auditTracking || []));
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
    setCalendarLoading(false);
  };

  const transformActivityData = (activityData) => ({
    id: activityData._id,
    client: activityData.client?.fullName || "Unknown Client",
    slug: activityData.slug,
    type: typeof activityData?.type === "object" ? activityData.type?.name : "Unknown Type",
    trademarkName: activityData?.trademarkName || "Unknown TrademarkName",
    trademarkNumber: activityData?.trademarkNumber || "Unknown TrademarkNumber",
    internalDeadline: activityData?.deadlines?.[activityData?.deadlines?.length - 1]?.deadline || null,
    officeDeadline: activityData?.deadlines?.[activityData?.deadlines?.length - 1]?.officeActionDeadline || null,
  });

  const transformAuditTrackingToEvents = (auditTracking) => {
    return auditTracking.flatMap((caseData) => {
      const clientName = caseData.client?.fullName || "Unknown Client";
      return (caseData.deadlines || []).map((deadline) => {
        if (!deadline.deadline) return null;

        const deadlineDate = new Date(deadline.deadline);
        const start = new Date(deadlineDate).setHours(0, 0, 0, 0);
        const end = new Date(deadlineDate).setHours(23, 59, 59, 999);

        return {
          start: new Date(start),
          end: new Date(end),
          title: clientName,
          resource: {
            caseId: caseData._id,
            slug: caseData.slug,
            deadlineStatus: deadline.deadlineStatus,
            deadline: deadline.deadline,
          },
        };
      });
    }).filter(Boolean); // Remove null values
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
        <h4>{new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h4>
        <p>{getGreeting}, John Doe.</p>
      </div>
      <div className="p24">
        <Row>
          <Col lg={7}>
            <Wrapper contentClassName={classes?.calenderWrapper} headerComponent={<CalenderHeaderDrop />}>
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
                      onClick={item.title === "Create New Case" ? () => setShowCreateNewCaseModal(true) : undefined}
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
              <ResponsiveTable tableHeader={staffDashboardTableHeader} data={recentActivities} />
            </Wrapper>
          </Col>
        </Row>
      </div>
      <CreateNewCaseModal show={showCreateNewCaseModal} setShow={setShowCreateNewCaseModal} />
    </div>
  );
};

export default DashboardTemplate;
