"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import classes from "./DashboardTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import CalenderHeaderDrop from "@/components/atoms/TableHeaderDrop/CalenderHeaderDrop";
import ActionCard from "@/components/molecules/ActionCard/ActionCard";
import { newCasesData } from "@/developementContent/Data/data";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { getStaffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import { useRouter } from "next/navigation";
import CreateNewCaseModal from "@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import useAxios from "@/interceptor/axios-functions";
import moment from "moment";
import { findCurrentStatusPhase, findNextPhase } from "@/resources/utils/caseHelper";
import CalendarEventDetailModal from "@/components/organisms/Modals/CalendarEventDetailModal/CalendarEventDetailModal";
import { useSelector } from "react-redux";
import { RenderDateCell } from "@/components/organisms/ResponsiveTable/CommonCells";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/styles/react-datepicker-inline-deadline.css";
import RenderToast from "@/components/atoms/RenderToast";
import { Loader } from "@/components/atoms/Loader";
import Link from "next/link";
import AddNoteModal from "@/components/organisms/Modals/AddNoteModal/AddNoteModal";
import { capitalizeFirstWord, getFormattedParams } from "@/resources/utils/helper";

const STAFF_CASE_MANAGEMENT_PATH = "/staff/case-management";

const NOTES_PREVIEW_LENGTH = 35;

const DashboardTemplate = () => {
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesModalNote, setNotesModalNote] = useState(null);
  const [notesModalLoading, setNotesModalLoading] = useState("");
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editingDeadlineSlug, setEditingDeadlineSlug] = useState(null);
  const [editingOfficeDeadlineSlug, setEditingOfficeDeadlineSlug] = useState(null);
  const [editingNextPhaseSlug, setEditingNextPhaseSlug] = useState(null);
  const [savingDeadline, setSavingDeadline] = useState(false);
  const [savingDeadlineType, setSavingDeadlineType] = useState(null);

  const { Get, Patch } = useAxios();
  const router = useRouter();
  const { user } = useSelector((state) => state.authReducer);
  const refreshDashboardRef = useRef(() => {});
  const isFirstDashboardFetch = useRef(true);

  /* Recent Activities filter - same pattern as CaseManagementTemplate */
  const [caseTypeFilters, setCaseTypeFilters] = useState([{ label: "All", value: "" }]);
  const [selectedCaseType, setSelectedCaseType] = useState({ label: "All", value: "" });
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivitiesLoading, setRecentActivitiesLoading] = useState(false);

  const hasCreateCasePermission = user?.permissions?.includes("create-case") ?? false;
  const hasUpdateCasePermission = user?.permissions?.includes("update-case") ?? false;

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const transformActivityData = useCallback((activity) => {
    const lastDeadline =
      activity?.deadlines?.[activity.deadlines.length - 1] ?? {};

    const currentPhase = findCurrentStatusPhase(activity);
    const nextPhase = findNextPhase(activity);

    return {
      id: activity._id,
      client: activity?.client?.fullName ?? "Unknown Client",
      slug: activity.slug,
      status: currentPhase.name,
      phaseBgColor: currentPhase.bgColor,
      phaseColor: currentPhase.color,
      caseNotes: activity?.caseNotes?.description ?? "",
      caseNote: activity?.caseNotes ?? null,
      nextPhaseName: nextPhase?.name ?? "—",
      nextPhaseBgColor: nextPhase?.bgColor ?? "#f5f5f5",
      nextPhaseColor: nextPhase?.color ?? "#000000",
      trademarkName: activity?.trademarkName ?? "Unknown Trademark",
      trademarkNumber: activity?.trademarkNumber ?? "Unknown Number",
      internalDeadline: lastDeadline.deadline ?? null,
      officeDeadline: lastDeadline.officeActionDeadline ?? null,
    };
  }, []);

  /* Same pattern as CaseManagementTemplate: API called with jurisdiction param when filter selected */
  const fetchDashboardData = useCallback(async (jurisdictionSlug) => {
    const isInitial = isFirstDashboardFetch.current;
    if (isInitial) {
      setLoading(true);
    } else {
      setRecentActivitiesLoading(true);
    }
    const queryParams = new URLSearchParams();
    if (jurisdictionSlug) {
      queryParams.append("jurisdiction", jurisdictionSlug);
    }
    const queryString = queryParams.toString();
    const route = queryString ? `users/dashboard?${queryString}` : "users/dashboard";
    const { response } = await Get({
      route,
      showAlert: false,
    });
    if (!response?.data) {
      if (isInitial) setLoading(false);
      else setRecentActivitiesLoading(false);
      return;
    }
    setDashboardData(response.data);
    if (isInitial) {
      setCalendarEvents(transformAuditTrackingToEvents(response.data.auditTracking || []));
      setLoading(false);
      isFirstDashboardFetch.current = false;
    } else {
      setRecentActivitiesLoading(false);
    }
  }, []);

  /* Fetch filter options - same as CaseManagementTemplate (jurisdiction/all) */
  const fetchCaseTypes = useCallback(async () => {
    const queryParams = new URLSearchParams({ status: "active" }).toString();
    const { response } = await Get({
      route: `jurisdiction/all?${queryParams}`,
      showAlert: false,
    });
    if (response?.data) {
      const options = (response.data || []).map((type) => ({
        label: type.name || "Unknown",
        value: type.slug || type._id,
      }));
      setCaseTypeFilters([{ label: "All", value: "" }, ...options]);
    }
  }, []);

  const transformAuditTrackingToEvents = useCallback((auditTracking) => {
    return auditTracking
      .flatMap((caseData) => {
        const typeObject = caseData.type || null;

        const clientName = caseData.client?.fullName || "Unknown Client";

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

          const phaseName = deadline.deadlineStatus || "Unknown Phase";

          return {
            start: new Date(start),
            end: new Date(end),
            title: phaseName,
            resource: {
              caseId: caseData._id,
              slug: caseData.slug,
              trademarkNumber: caseData.trademarkNumber,
              clientName,
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
  }, []);

  const fetchCalendarData = useCallback(async () => {
    setCalendarLoading(true);
    const { startDate, endDate } = getDateRange(currentView, currentDate);
    const queryParams = new URLSearchParams({ startDate, endDate });
    const { response } = await Get({
      route: `users/dashboard?${queryParams.toString()}`,
      showAlert: false,
    });
    if (response?.data?.auditTracking) {
      setCalendarEvents(transformAuditTrackingToEvents(response.data.auditTracking));
    }
    setCalendarLoading(false);
  }, [currentView, currentDate, transformAuditTrackingToEvents]);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  const handleEditDeadlineClick = useCallback((slug) => {
    setEditingDeadlineSlug((prev) => (prev === slug ? null : slug));
  }, []);

  const handleEditOfficeDeadlineClick = useCallback((slug) => {
    setEditingOfficeDeadlineSlug((prev) => (prev === slug ? null : slug));
  }, []);

  const handleEditNextPhaseClick = useCallback((slug) => {
    setEditingNextPhaseSlug((prev) => (prev === slug ? null : slug));
  }, []);

  const saveDeadline = useCallback(async (slug, newDate, type) => {
    if (!slug) return;
    setSavingDeadline(true);
    setSavingDeadlineType(type);
    try {
      const { response } = await Get({ route: `case/detail/${slug}`, showAlert: false });
      const deadlines = response?.data?.deadlines ?? [];
      const newDateIso = new Date(newDate).toISOString();

      const normalize = (d) => ({
        deadline: new Date(d.deadline).toISOString(),
        officeActionDeadline: d.officeActionDeadline ? new Date(d.officeActionDeadline).toISOString() : undefined,
        ...(d.optional === true && { optional: true }),
      });

      let updated;
      if (type === "nextPhase") {
        const existing = deadlines.map(normalize);
        updated = [...existing, { deadline: newDateIso, officeActionDeadline: undefined, optional: false }];
      } else {
        if (!deadlines.length) return;
        const isLast = (i) => i === deadlines.length - 1;
        updated = deadlines.map((d, i) => {
          const base = normalize(d);
          if (type === "internal") {
            return { ...base, deadline: isLast(i) ? newDateIso : base.deadline };
          }
          if (type === "office") {
            return { ...base, officeActionDeadline: isLast(i) ? newDateIso : base.officeActionDeadline };
          }
          return base;
        });
      }

      const { response: patchRes } = await Patch({
        route: `case/update/${slug}`,
        data: { deadlines: updated },
        showAlert: true,
      });
      if (patchRes) {
        RenderToast({ type: "success", message: "Deadlines updated successfully" });
        if (type === "internal") setEditingDeadlineSlug(null);
        if (type === "office") setEditingOfficeDeadlineSlug(null);
        if (type === "nextPhase") setEditingNextPhaseSlug(null);
        refreshDashboardRef.current();
      }
    } finally {
      setSavingDeadline(false);
      setSavingDeadlineType(null);
    }
  }, []);

  const saveDeadlineDate = useCallback((slug, newDate) => saveDeadline(slug, newDate, "internal"), [saveDeadline]);
  const saveOfficeDeadlineDate = useCallback((slug, newDate) => saveDeadline(slug, newDate, "office"), [saveDeadline]);
  const saveNextPhaseDate = useCallback((slug, newDate) => saveDeadline(slug, newDate, "nextPhase"), [saveDeadline]);

  const handleNotesSubmit = useCallback(async (values) => {
    if (!notesModalNote?._id) return;
    setNotesModalLoading("loading");
    const { response } = await Patch({
      route: `case-note/update/${notesModalNote._id}`,
      data: {
        title: values.noteTitle,
        description: values.description,
        permissions: values.permissible || [],
      },
      showAlert: true,
    });
    if (response) {
      setShowNotesModal(false);
      setNotesModalNote(null);
      refreshDashboardRef.current();
    }
    setNotesModalLoading("");
  }, [notesModalNote, Patch]);

  const renderDeadlineCellWithCalendar = useCallback(
    (item, slug, isEditing, onToggleEdit, onSave, calendarType) => {
      const currentDate = item ? new Date(item) : new Date();
      const isValidDate = currentDate instanceof Date && !Number.isNaN(currentDate.getTime());
      const showLoader = savingDeadline && savingDeadlineType === calendarType;
      const canEdit = hasUpdateCasePermission && slug;
      if (!canEdit) {
        return <RenderDateCell cellValue={item} />;
      }
      return (
        <div className={classes.internalDeadlineCell}>
          <button
            type="button"
            className={classes.internalDeadlineDisplay}
            onClick={(e) => {
              e.stopPropagation();
              onToggleEdit(slug);
            }}
            aria-label={isEditing ? "Close calendar" : "Change deadline"}
            aria-expanded={isEditing}
            disabled={savingDeadline}
          >
            <RenderDateCell cellValue={item} />
          </button>
          {isEditing && (
            <div
              className={classes.inlineCalendarWrap}
              data-inline-deadline-calendar
              onClick={(e) => e.stopPropagation()}
            >
              <ReactDatePicker
                selected={isValidDate ? currentDate : new Date()}
                onChange={(date) => date && onSave(slug, date)}
                inline
                disabled={savingDeadline}
              />
              {showLoader && (
                <div className={classes.deadlineSavingOverlay} aria-hidden="true">
                  <Loader />
                </div>
              )}
            </div>
          )}
        </div>
      );
    },
    [savingDeadline, savingDeadlineType, hasUpdateCasePermission]
  );

  const baseTableHeader = useMemo(
    () =>
      getStaffDashboardTableHeader({
        hasUpdateCasePermission,
        viewDetailsBasePath: STAFF_CASE_MANAGEMENT_PATH,
      }),
    [hasUpdateCasePermission]
  );

  const dashboardTableHeader = useMemo(() => {
    return baseTableHeader.map((col) => {
      if (col.key === "internalDeadline") {
        return {
          ...col,
          renderItem: ({ item, data }) => {
            const slug = data?.slug;
            const isEditing = slug && editingDeadlineSlug === slug;
            return renderDeadlineCellWithCalendar(
              item,
              slug,
              isEditing,
              handleEditDeadlineClick,
              saveDeadlineDate,
              "internal"
            );
          },
        };
      }
      if (col.key === "officeDeadline") {
        return {
          ...col,
          renderItem: ({ item, data }) => {
            const slug = data?.slug;
            const isEditing = slug && editingOfficeDeadlineSlug === slug;
            return renderDeadlineCellWithCalendar(
              item,
              slug,
              isEditing,
              handleEditOfficeDeadlineClick,
              saveOfficeDeadlineDate,
              "office"
            );
          },
        };
      }
      if (col.key === "notes") {
        return {
          ...col,
          renderItem: ({ data }) => {
            const full = data?.caseNotes ? getFormattedParams(data.caseNotes.toString()) : "";
            const display = full || "—";
            const preview = typeof full === "string" && full.length > NOTES_PREVIEW_LENGTH
              ? `${full.slice(0, NOTES_PREVIEW_LENGTH)}....`
              : display;
            const canEdit = data?.caseNote?._id;
            if (!canEdit) {
              return <span className={classes.notesCellText} title={display}>{preview}</span>;
            }
            return (
              <button
                type="button"
                className={classes.notesCellButton}
                title={display}
                onClick={(e) => {
                  e.stopPropagation();
                  setNotesModalNote(data.caseNote);
                  setShowNotesModal(true);
                }}
              >
                {preview}
              </button>
            );
          },
        };
      }
      if (col.key === "status") {
        return {
          ...col,
          renderItem: ({ item, data }) => {
            const bgColor = data?.phaseBgColor ?? "#f5f5f5";
            const color = data?.phaseColor ?? "#000000";
            return (
              <span
                className={classes.statusPill}
                style={{ backgroundColor: bgColor, color }}
              >
                {item ?? "—"}
              </span>
            );
          },
        };
      }
      if (col.key === "nextPhaseName") {
        return {
          ...col,
          renderItem: ({ item, data }) => {
            const slug = data?.slug;
            const displayValue = item ?? "—";
            const isEmpty = displayValue === "—" || String(displayValue).trim() === "";
            const bgColor = data?.nextPhaseBgColor ?? "#f5f5f5";
            const color = data?.nextPhaseColor ?? "#000000";
            const hasNextPhase = item != null && String(item).trim() !== "" && item !== "—" && slug;
            const isEditing = slug && editingNextPhaseSlug === slug;
            const canEdit = hasUpdateCasePermission && hasNextPhase;
            const pillClassName = [
              classes.nextPhasePill,
              isEmpty && classes.nextPhasePillEmpty,
              canEdit && classes.nextPhasePillButton,
            ].filter(Boolean).join(" ");
            if (!canEdit) {
              return (
                <span className={pillClassName} style={isEmpty ? undefined : { backgroundColor: bgColor, color }}>
                  {displayValue}
                </span>
              );
            }
            return (
              <div className={classes.internalDeadlineCell}>
                <button
                  type="button"
                  className={pillClassName}
                  style={{ backgroundColor: bgColor, color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNextPhaseClick(slug);
                  }}
                  aria-label={isEditing ? "Close calendar" : "Set date for next phase"}
                  aria-expanded={isEditing}
                  disabled={savingDeadline}
                >
                  {item}
                </button>
                {isEditing && (
                  <div
                    className={classes.inlineCalendarWrap}
                    data-inline-deadline-calendar
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ReactDatePicker
                      selected={new Date()}
                      onChange={(date) => date && saveNextPhaseDate(slug, date)}
                      inline
                      disabled={savingDeadline}
                    />
                    {savingDeadline && savingDeadlineType === "nextPhase" && (
                      <div className={classes.deadlineSavingOverlay} aria-hidden="true">
                        <Loader />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          },
        };
      }
      if (col.key === "slug") {
        return {
          ...col,
          renderItem: ({ item }) => (
            <Link href={`${STAFF_CASE_MANAGEMENT_PATH}/${item}`} className={classes.viewDetailsLink}>
              View Details
            </Link>
          ),
        };
      }
      return col;
    });
  }, [
    baseTableHeader,
    renderDeadlineCellWithCalendar,
    editingDeadlineSlug,
    editingOfficeDeadlineSlug,
    editingNextPhaseSlug,
    savingDeadline,
    savingDeadlineType,
    hasUpdateCasePermission,
  ]);

  /* Recent activities from API (backend returns filtered list when jurisdiction param sent) */
  const recentActivities = useMemo(() => {
    return (dashboardData?.recentActivities ?? []).map(transformActivityData);
  }, [dashboardData, transformActivityData]);

  refreshDashboardRef.current = () => fetchDashboardData(selectedCaseType?.value ?? "");

  /* When selectedCaseType changes, API is called with filter - same as CaseManagementTemplate */
  useEffect(() => {
    fetchDashboardData(selectedCaseType?.value ?? "");
  }, [selectedCaseType, fetchDashboardData]);

  /* Fetch jurisdiction filter options on mount */
  useEffect(() => {
    fetchCaseTypes();
  }, [fetchCaseTypes]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

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
        <p>{getGreeting()}, {capitalizeFirstWord(user?.fullName)}.</p>
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
                  onClickViewAll={() => router.push(STAFF_CASE_MANAGEMENT_PATH)}
                  title="Recent Activities"
                  hideSearch
                  hideFilter
                  hideDropdown={false}
                  dropdownOptions={caseTypeFilters}
                  selectedDropdownValue={selectedCaseType}
                  setSelectedDropdownValue={(value) => {
                    setSelectedCaseType(value ?? { label: "All", value: "" });
                  }}
                />
              }
              className={classes.wrapper}
              contentClassName={`${classes.contentClassName} ${classes.recentActivitiesTable}`}
            >
              {recentActivitiesLoading ? (
                <LoadingSkeleton height="200px" />
              ) : (
                <ResponsiveTable
                  tableHeader={dashboardTableHeader}
                  data={recentActivities}
                />
              )}
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
        routePrefix="/staff/case-management"
      />
      <AddNoteModal
        show={showNotesModal}
        loading={notesModalLoading}
        setShow={(show) => {
          setShowNotesModal(show);
          if (!show) setNotesModalNote(null);
        }}
        handleSubmit={handleNotesSubmit}
        isEditMode={!!notesModalNote}
        initialData={notesModalNote ? { title: notesModalNote.title, description: notesModalNote.description, permissible: notesModalNote.permissions || notesModalNote.permissible } : null}
      />
    </div>
  );
};

export default DashboardTemplate;
