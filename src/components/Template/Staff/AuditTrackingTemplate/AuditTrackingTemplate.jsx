"use client";
import React, { useState, useEffect, useRef } from "react";
import classes from "./AuditTrackingTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import CircularCaseProgressChart from "@/components/atoms/CircularCaseProgressChart/CircularCaseProgressChart";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import Calender from "@/components/molecules/Calender/Calender";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import { reactActivities } from "@/developementContent/Enums/enum";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { useRouter } from "next/navigation";
import useAxios from "@/interceptor/axios-functions";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import moment from "moment";
import CalendarEventDetailModal from "@/components/organisms/Modals/CalendarEventDetailModal/CalendarEventDetailModal";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { calculateProgress, findCurrentStatusPhase, findNextPhase } from "@/resources/utils/caseHelper";

const AuditTrackingTemplate = () => {
  const router = useRouter();
  const { Get } = useAxios();
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(reactActivities[0]);
  const [loading, setLoading] = useState("");
  const [kpiData, setKpiData] = useState(null);
  const [caseProgressData, setCaseProgressData] = useState([]);
  const [overdueCases, setOverdueCases] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentActivitiesPage, setRecentActivitiesPage] = useState(1);
  const [recentActivitiesTotalRecords, setRecentActivitiesTotalRecords] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isInitialMount = useRef(true);
  const isRecentActivitiesInitialMount = useRef(true);

  // Get date range based on view and date
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

  // Transform case progress count for circular chart
  const transformCaseProgressData = (progressCount) => {
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
    ];
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return moment(dateString).format("MMM DD, YY");
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

  // Transform overdue case data for CaseProgressCard
  const transformOverdueCaseData = (caseData) => {
    return {
      id: caseData._id,
      slug: caseData.slug || caseData._id,
      tabLabel: caseData.status || "Case",
      userName: caseData.primaryStaff?.fullName || "Unassigned",
      progress: calculateProgress(caseData),
      status: caseData.status || "Pending",
      trademarkName: caseData.trademarkName || "",
      trademarkNo: caseData.trademarkNumber || "",
      deadline: getNextDeadline(caseData.deadlines),
      clientName: caseData.client?.fullName || "Unknown Client",
    };
  };

  // Transform activity data for table (same shape as dashboard for status, next phase, notes)
  const transformActivityData = (activityData) => {
    const lastDeadline = activityData?.deadlines?.[activityData?.deadlines?.length - 1] ?? {};
    const currentPhase = findCurrentStatusPhase(activityData);
    const nextPhase = findNextPhase(activityData);

    return {
      id: activityData._id,
      client: activityData.client?.fullName || "Unknown Client",
      slug: activityData.slug,
      type: typeof activityData?.type === "object" ? activityData.type?.name : "Unknown Type",
      trademarkName: activityData?.trademarkName || "Unknown TrademarkName",
      trademarkNumber: activityData?.trademarkNumber || "Unknown TrademarkNumber",
      internalDeadline: lastDeadline.deadline ?? null,
      officeDeadline: lastDeadline.officeActionDeadline ?? null,
      status: currentPhase.name,
      phaseBgColor: currentPhase.bgColor,
      phaseColor: currentPhase.color,
      nextPhaseName: nextPhase?.name ?? "—",
      nextPhaseBgColor: nextPhase?.bgColor ?? "#f5f5f5",
      nextPhaseColor: nextPhase?.color ?? "#000000",
      caseNotes: activityData?.caseNotes?.description ?? "",
    };
  };


  // Transform audit tracking to calendar events
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
      .filter(Boolean);
  };

  // Fetch only recent activities
  const fetchRecentActivities = async (page = recentActivitiesPage) => {
    setLoading("recentActivities");
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({
      search: "",
      type: selectedDropdownValue?.value || "",
      startDate,
      endDate,
      page: page.toString(),
      limit: RECORDS_LIMIT.toString(),
    });
      const { response } = await Get({
        route: `users/kpi-tracking?${queryParams.toString()}`,
        showAlert: false,
      });
      if (response) {
        // Transform recent activities
        // recentActivities is an object with data array: { data: [...], results: 5, totalRecords: 5 }
        const recentActivitiesData = response.data?.recentActivities;
        let recentActivitiesArray = [];
        let totalRecords = 0;
        
        if (Array.isArray(recentActivitiesData?.data)) {
          recentActivitiesArray = recentActivitiesData.data;
          totalRecords = recentActivitiesData.totalRecords || 0;
        } else if (Array.isArray(recentActivitiesData)) {
          recentActivitiesArray = recentActivitiesData;
        } else if (recentActivitiesData?.totalRecords !== undefined) {
          totalRecords = recentActivitiesData.totalRecords;
        }
        
        const activities = recentActivitiesArray.map(transformActivityData);
        setRecentActivities(activities);
        setRecentActivitiesTotalRecords(totalRecords);
        setRecentActivitiesPage(page);
      }
      setLoading("");

    
  };



  // Fetch KPI tracking data (without recent activities)
  const fetchKpiTrackingData = async () => {
    setLoading("kpi");
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({
      search: "",
      type: "",
      startDate,
      endDate,
      limit: RECORDS_LIMIT.toString(),
    });

      const { response } = await Get({
        route: `users/kpi-tracking?${queryParams.toString()}`,
        showAlert: false,
      });
      if (response) {
        setKpiData(response.data);        
        const progressData = transformCaseProgressData(response.data?.caseProgressCount || {});
        setCaseProgressData(progressData);
        const overdueCaseProgressData = response.data?.overdueCaseProgress;
        const overdueCasesArray = Array.isArray(overdueCaseProgressData)
          ? overdueCaseProgressData
          : [];
        const overdueCasesData = overdueCasesArray
          .slice(0, 2)
          .map(transformOverdueCaseData);
        setOverdueCases(overdueCasesData);
        
        // Transform calendar events
        const auditTrackingArray = Array.isArray(response.data?.auditTracking)
          ? response.data.auditTracking
          : [];
        const events = transformAuditTrackingToEvents(auditTrackingArray);
        setCalendarEvents(events);
        
        // Transform recent activities on initial load
        const recentActivitiesData = response.data?.recentActivities;
        let recentActivitiesArray = [];
        let totalRecords = 0;
        
        if (Array.isArray(recentActivitiesData?.data)) {
          recentActivitiesArray = recentActivitiesData.data;
          totalRecords = recentActivitiesData.totalRecords || 0;
        } else if (Array.isArray(recentActivitiesData)) {
          recentActivitiesArray = recentActivitiesData;
        } else if (recentActivitiesData?.totalRecords !== undefined) {
          totalRecords = recentActivitiesData.totalRecords;
        }
        
        const activities = recentActivitiesArray.map(transformActivityData);
        setRecentActivities(activities);
        setRecentActivitiesTotalRecords(totalRecords);
      }
      setLoading("");

    
  };

  // Fetch calendar data when view or date changes
  const fetchCalendarData = async () => {
    setLoading("calendar");
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({
      search: "",
      type: "",
      startDate,
      endDate,
    });
      const { response } = await Get({
        route: `users/kpi-tracking?${queryParams.toString()}`,
        showAlert: false,
      });
      if (response?.status === "success" && response.data) {
        const auditTrackingArray = Array.isArray(response.data?.auditTracking)
          ? response.data.auditTracking
          : [];
        const events = transformAuditTrackingToEvents(auditTrackingArray);
        setCalendarEvents(events);
      }
      setLoading("");

    
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchKpiTrackingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch calendar data when view or date changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (currentView && currentDate) {
      fetchCalendarData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, currentDate]);

  // Fetch recent activities when search, dropdown, or page changes
  useEffect(() => {
    // Skip on initial mount to allow SpinnerLoading to show for KPI data
    if (isRecentActivitiesInitialMount.current) {
      isRecentActivitiesInitialMount.current = false;
      return;
    }
    fetchRecentActivities(recentActivitiesPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDropdownValue, recentActivitiesPage]);

  // Reset page to 1 when search or dropdown changes
  useEffect(() => {
    if (isRecentActivitiesInitialMount.current) {
      return;
    }
    setRecentActivitiesPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDropdownValue]);

  // Handle calendar event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  if (loading === "kpi") {
    return (
      <div className="p24">
        <SpinnerLoading />
      </div>
    );
  }

  const totalCases = 
    (kpiData?.caseProgressCount?.inProgressCases || 0) +
    (kpiData?.caseProgressCount?.completedCases || 0) +
    (kpiData?.caseProgressCount?.notStartedCases || 0);


  return (
    <div className="p24">
      <Row>
        <Col lg={6} xl={5}>
          <Wrapper
            contentClassName={classes?.contentClassName}
            title="Audit Tracking"
          >
            <div className={classes.circularCaseProgressChart}>
              <CircularCaseProgressChart 
                data={caseProgressData} 
                centerText={totalCases.toString()}
              />
            </div>
          </Wrapper>
        </Col>
        <Col lg={6} xl={7}>
          <Wrapper
            contentClassName={classes?.contentClassName}
            title="Overdue Case Progresses"
          >
            <div className={classes.overdueCasesContainer}>
              {overdueCases.length > 0 ? (
                <Row className="g-4">
                  {overdueCases.map((item) => (
                    <Col className="col-12 col-md-6" key={item.id}>
                      <CaseProgressCard 
                        isStatusVariant
                        routePath={`/staff/case-management/${item.slug}`}
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
              ) : (
                <div>No overdue cases found</div>
              )}
            </div>
          </Wrapper>
        </Col>
        <Col sm={12}>
          {loading === "calendar" ? (
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
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Wrapper
            headerComponent={
              <TableHeader
                viewButtonText="View All"
                onClickViewAll={() => router.push("/staff/case-management")}
                title="Recent Activities"
                hideSearch
              />
            }
            contentClassName={classes.contentClassName}
          >
            {loading === "recentActivities" ? (
              <LoadingSkeleton height="200px" />
            ) : (
              <ResponsiveTable
                tableHeader={staffDashboardTableHeader}
                data={recentActivities}
                pagination={true}
                page={recentActivitiesPage}
                totalRecords={recentActivitiesTotalRecords}
                onPageChange={(newPage) => {
                  setRecentActivitiesPage(newPage);
                }}
                totalTextLabel="Recent Activities"
              />
            )}
          </Wrapper>
        </Col>
      </Row>
      <CalendarEventDetailModal
        show={showEventModal}
        setShow={setShowEventModal}
        event={selectedEvent}
        routePrefix="/staff/case-management"
      />
    </div>
  );
};

export default AuditTrackingTemplate;
