"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import classes from "./DashboardTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { Col, Row } from "react-bootstrap";
import BannerMessage from "@/components/atoms/BannerMessage/BannerMessage";
import MainHeader from "@/components/atoms/MainHeader/MainHeader";
import { myUserCaseTableHeader } from "@/developementContent/TableHeader/MyCasesTableHeader";
import CircularCaseProgressChart from "@/components/atoms/CircularCaseProgressChart/CircularCaseProgressChart";
import { useRouter } from "next/navigation";
import useAxios from "@/interceptor/axios-functions";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import moment from "moment";
import { findNextPhase } from "@/resources/utils/caseHelper";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import CalendarEventDetailModal from "@/components/organisms/Modals/CalendarEventDetailModal/CalendarEventDetailModal";

const DashboardTemplate = () => {
  const router = useRouter();
  const [showBannerMessage, setShowBannerMessage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [caseProgressData, setCaseProgressData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isInitialMount = useRef(true);
  const { Get } = useAxios();

  const getGreeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return "Good morning";
    if (currentHour >= 12 && currentHour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

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

  const transformCaseData = (caseData) => {
    const latestDeadline = caseData.deadlines?.[caseData.deadlines.length - 1];
    
    // Find the phase that matches the case status
    const currentStatus = caseData.status || "";
    const matchingPhase = caseData.type?.phases?.find(
      (phase) => phase.name === currentStatus
    );
    
    const nextPhase = findNextPhase(caseData);
    
    return {
      id: caseData.slug || caseData._id,
      typeOfCase: caseData.type?.name || "Unknown Type",
      trademarkName: caseData.trademarkName || "",
      trademarkNumber: caseData.trademarkNumber || "",
      status: caseData.status || "Unknown",
      statusVariant: caseData.status || "default",
      phaseBgColor: matchingPhase?.bgColor || null,
      phaseColor: matchingPhase?.color || null,
      officeDeadline: latestDeadline?.officeActionDeadline || null,
      nextPhaseName: nextPhase?.name ?? "—",
      nextPhaseBgColor: nextPhase?.bgColor ?? null,
      nextPhaseColor: nextPhase?.color ?? null,
      slug: caseData.slug || caseData._id,
    };
  };

  const transformCalendarEvents = (cases) => {
    const events = [];
    cases.forEach((caseData) => {
      if (caseData.deadlines && Array.isArray(caseData.deadlines)) {
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
              title: deadline.deadlineStatus || "—",
              resource: {
                caseId: caseData._id,
                slug: caseData.slug,
                deadlineStatus: deadline.deadlineStatus,
                deadline: deadline.deadline,
              },
            });
          }
        });
      }
    });
    return events;
  };

  const transformCaseProgressData = (progressCount) => {
    const total = 
      (progressCount.inProgressCases || 0) +
      (progressCount.completedCases || 0) +
      (progressCount.notStartedCases || 0);

    return [
      {
        label: "In Progress",
        value: progressCount.inProgressCases || 0,
        color: "#4A90E2",
      },
      {
        label: "Completed",
        value: progressCount.completedCases || 0,
        color: "#50C878",
      },
      {
        label: "Not Started",
        value: progressCount.notStartedCases || 0,
        color: "#FFA500",
      },
    ].filter(item => item.value > 0);
  };

  const getDashboardData = async () => {
    setLoading(true);
    const { response } = await Get({ route: "users/dashboard", showAlert: false });
    if (response) {
      setDashboardData(response?.data);
      const transformedCases = (response?.data?.recentCases || []).map(transformCaseData);
      setRecentCases(transformedCases);
      const progressData = transformCaseProgressData(response?.data?.caseProgressCount || {});
      setCaseProgressData(progressData);
    }
    setLoading(false);
  };

  const fetchCalendarData = async () => {
    setCalendarLoading(true);
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({ startDate, endDate });

    const { response } = await Get({ 
      route: `users/dashboard?${queryParams.toString()}`, 
      showAlert: false 
    });
    if (response) {
      const events = transformCalendarEvents(response?.data?.recentCases || []);
      setCalendarEvents(events);
    }
    setCalendarLoading(false);
  };

  useEffect(() => {
    getDashboardData();
    // Fetch initial calendar data with current month
    const { startDate, endDate } = getDateRange("month", new Date());
    const queryParams = new URLSearchParams({ startDate, endDate });
    const fetchInitialCalendar = async () => {
      setCalendarLoading(true);
      const { response } = await Get({
        route: `users/dashboard?${queryParams.toString()}`,
        showAlert: false,
      });
      if (response) {
        const events = transformCalendarEvents(response?.data?.recentCases || []);
        setCalendarEvents(events);
      }
      setCalendarLoading(false);
    };
    fetchInitialCalendar();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (currentView && currentDate) {
      fetchCalendarData();
    }
  }, [currentView, currentDate]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  if (loading) return <SpinnerLoading />;

  return (
    <div>
      <Row>
        <Col className="col-12 col-md-8">
          <div className={classes.leftTop}>
            <div className={classes.dateText}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <h4>{getGreeting}, Joe.</h4>
          </div>
          <BannerMessage
            show={showBannerMessage}
            setShow={setShowBannerMessage}
          />
          <MainHeader onClickViewAll={() => router.push('/user/my-cases')} />
          <Wrapper title="My Cases" className={classes.wrapper} contentClassName={classes.contentClassName}>
            <ResponsiveTable
              tableHeader={myUserCaseTableHeader}
              data={recentCases}
            />
          </Wrapper>
          <Wrapper title="Recent Case Statuses">
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
        </Col>
        <Col className="col-12 col-md-4">
          <Wrapper title="Case Progress Count By Status">
            <div className={classes.circularCaseProgressChart}>
              <CircularCaseProgressChart 
                data={caseProgressData}
                centerText={`${(dashboardData?.caseProgressCount?.inProgressCases || 0) + (dashboardData?.caseProgressCount?.completedCases || 0) + (dashboardData?.caseProgressCount?.notStartedCases || 0)}`}
              />
            </div>
          </Wrapper>
        </Col>
      </Row>
      <CalendarEventDetailModal
        show={showEventModal}
        setShow={setShowEventModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default DashboardTemplate;

{
  /* <Calender events={myEventsList} /> */
}
{
  /* <ResponsiveTable 
tableHeader={[{
  title: "Case ID",
  key: "caseId",
},{
  title: "Case Status",
  key: "caseStatus",
}]}
data={[{
  caseId: "123456",
  caseStatus: "Open",
},{
  caseId: "123456",
  caseStatus: "Open",
}]}
/> */
}
