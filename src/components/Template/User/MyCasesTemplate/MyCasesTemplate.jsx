"use client";
import React, { useState, useEffect } from "react";
import classes from "./MyCasesTemplate.module.css";
import BreadComTop from "@/components/atoms/BreadComTop/BreadComTop";
import { Col, Row } from "react-bootstrap";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import useAxios from "@/interceptor/axios-functions";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import useDebounce from "@/resources/hooks/useDebounce";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import { FaRegFolderClosed } from "react-icons/fa6";
import Pagination from "@/components/molecules/Pagination/Pagination";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import { calculateProgress } from "@/resources/utils/caseHelper";

// Helper function to format status (convert kebab-case to Title Case)
const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

// Get next office deadline
const getNextOfficeDeadline = (deadlines = []) => {
  if (!deadlines || deadlines.length === 0) return "";
  const now = new Date();
  const upcomingDeadlines = deadlines
    .filter((d) => {
      const deadlineDate = new Date(d.officeActionDeadline || d.deadline);
      return deadlineDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.officeActionDeadline || a.deadline);
      const dateB = new Date(b.officeActionDeadline || b.deadline);
      return dateA - dateB;
    });
  return upcomingDeadlines.length > 0
    ? formatDate(upcomingDeadlines[0].officeActionDeadline || upcomingDeadlines[0].deadline)
    : "";
};

const MyCasesTemplate = () => {
  const [loading, setLoading] = useState("");
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [caseStats, setCaseStats] = useState({
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
  });
  const debouncedSearch = useDebounce(searchValue, 500);
  const { Get } = useAxios();


  const getCasesData = async (_page) => {
    setLoading("loading");
    const currentPage = typeof _page === 'number' ? _page : page;
    const query = {
      search: debouncedSearch || "",
      page: currentPage,
      limit: RECORDS_LIMIT,
    };
    const queryString = new URLSearchParams(query).toString();
    const { response } = await Get({
      route: `case/all?${queryString}`,
      showAlert: false,
    });
    if (response) {
      setData(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
      // Extract case statistics from response
      setCaseStats({
        totalCases: response?.totalCases || 0,
        activeCases: response?.activeCases || 0,
        completedCases: response?.completedCases || 0,
      });
      if (typeof _page === 'number') {
        setPage(_page);
      }
    }
    setLoading("");
  };

  useEffect(() => {
    getCasesData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Transform case data for CaseProgressCard
  const transformCaseData = (caseData) => {
    const status = caseData?.status || "Unknown";
    const formattedStatus = formatStatus(status);

    return {
      id: caseData._id,
      slug: caseData.slug || caseData._id,
      tabLabel: formattedStatus,
      userName: caseData.primaryStaff?.fullName || "Unassigned",
      progress: calculateProgress(caseData),
      status: formattedStatus,
      trademarkName: caseData.trademarkName || "",
      trademarkNo: caseData.trademarkNumber || "",
      deadline: getNextOfficeDeadline(caseData.deadlines),
      officeDeadline: caseData.deadlines?.[0]?.officeActionDeadline
        ? new Date(caseData.deadlines[0].officeActionDeadline).toISOString().split("T")[0]
        : "",
      clientName: caseData.client?.fullName || "Unknown Client",
      reference: {
        referenceName: "Reference",
        link: "#",
        refrenece: [],
      },
    };
  };

  const transformedData = data?.map(transformCaseData) || [];

  if (loading === "loading") {
    return <SpinnerLoading />;
  }

  // Prepare stats data for BreadComTop component
  const statsData = [
    {
      title: "Total Cases",
      value: caseStats.totalCases,
    },
    {
      title: "Active Cases",
      value: caseStats.activeCases,
    },
    {
      title: "Completed Cases",
      value: caseStats.completedCases,
    },
  ];

  return (
    <>
      <BreadComTop statesCaseData={statsData} />
      <div className="p24">
        <Wrapper
          headerComponent={
            <TableHeader
              title="My Cases"
              titleIcon={<FaRegFolderClosed color="#D9D9D9" size={20} />}
              searchValue={searchValue}
              onSearchChange={(value) => {
                setPage(1);
                setSearchValue(value);
              }}
              searchPlaceholder="Search cases..."
            />
          }
          contentClassName={classes.contentClassName}
        >
          <div className={classes.caseManagementCards}>
            {transformedData?.length > 0 ? (
              <>
                <Row className="g-4">
                  {transformedData.map((item) => (
                    <Col className="col-12 col-md-6  col-xl-4" key={item.id}>
                      <CaseProgressCard
                        isStatusVariant
                        routePath={`/user/my-cases/${item.slug}`}
                        data={{
                          tabLabel: item.tabLabel,
                          userName: item.userName,
                          progress: item.progress,
                          status: item.status,
                          trademarkName: item.trademarkName,
                          trademarkNo: item.trademarkNo,
                          deadline: item.deadline,
                          officeDeadline: item.officeDeadline,
                          clientName: item.clientName,
                          reference: item.reference,
                        }}
                        showReference={true}
                      />
                    </Col>
                  ))}
                </Row>
                {totalRecords > RECORDS_LIMIT && (
                  <Pagination
                    currentPage={page}
                    totalRecords={totalRecords}
                    limit={RECORDS_LIMIT}
                    onPageChange={(newPage) => {
                      getCasesData(newPage);
                    }}
                    totalTextLabel="Cases"
                  />
                )}
              </>
            ) : (
              <NoDataFound text="No cases found" />
            )}
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default MyCasesTemplate;
