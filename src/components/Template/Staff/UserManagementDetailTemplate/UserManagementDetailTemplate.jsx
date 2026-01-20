"use client";
import React, { useEffect, useState } from "react";
import classes from "./UserManagementDetailTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Button from "@/components/atoms/Button";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Col, Row } from "react-bootstrap";
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import DetailActionsWithStats from "@/components/atoms/DetailActionsWithStats/DetailActionsWithStats";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import useAxios from "@/interceptor/axios-functions";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import { capitalizeFirstWord } from "@/resources/utils/helper";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { calculateProgress } from "@/resources/utils/caseHelper";

const UserManagementDetailTemplate = ({ slug }) => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const dispatch = useDispatch();
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState("");
  const [data, setData] = useState(null);
  const [cases, setCases] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { Get, Patch } = useAxios();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
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

  const getUserDetails = async (page = 1) => {
    setLoading("loading");
    const query = {
      page: page,
      limit: RECORDS_LIMIT,
    };
    const queryString = new URLSearchParams(query).toString();
    const { response } = await Get({
      route: `users/detail/${slug}?${queryString}`,
      showAlert: false,
    });
    if (response) {
      setRole(response?.user?.role);
      setData({ user: response?.user });
      setCases(response?.data || []);
      setTotalRecords(response?.totalRecords || 0);
      const statsData = [
        { title: "Total Cases", value: response?.totalRecords || 0 },
        { title: "Active Cases", value: response?.results || 0 },
        { title: "Completed Cases", value: 0 },
      ];
      setStatsData(statsData);
    }
    setLoading("");
  };



  const handleActivateDeactivateClick = () => {
    setShowConfirmModal(true);
  };

  // Determine button label and status variant based on user status
  const userStatus = data?.user?.status || '';
  const isActive = userStatus?.toLowerCase() === 'active';
  const statusVariant = isActive ? 'success' : 'secondary';

  useEffect(() => {
    if (slug) {
      getUserDetails(1);
      setCurrentPage(1);
    }
  }, [slug]);

  useEffect(() => {
    if (slug && currentPage > 1) {
      getUserDetails(currentPage);
    }
  }, [currentPage]);

  if (loading === "loading") {
    return <SpinnerLoading />;
  }


  // Transform case data for CaseProgressCard
  const transformCaseData = (caseData) => {
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

  // Transform cases for display
  const transformedCases = cases?.map(transformCaseData) || [];

  console.log("transformedCases",cases);

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
        <div className={classes.content}>
          <div className={classes.userDetailContainer}>
            <Row>
              <Col md={6}>
                <div className={classes.userDetailItemContainer}>
                  <div className={classes.userDetailItem}>
                    <div className={classes.userDetailItemTitle}>
                      <FiUser size={16} color="#8484AE" />
                      <h5>{role === "staff" ? "Staff Name" : "Client Name"}</h5>
                    </div>
                    <h4>{capitalizeFirstWord(data?.user?.fullName) || "Unknown"}</h4>
                  </div>
                  {role === "client" && (
                    <div className={classes.userDetailItem}>
                      <div className={classes.userDetailItemTitle}>
                        <MdOutlineEmail size={16} color="#8484AE" />
                        <h5>Email</h5>
                      </div>
                      <h4>{data?.user?.email || "No email"}</h4>
                    </div>
                  )}
                  
                </div>
              </Col>
              <Col md={6}>
                <div className={classes.userDetailItemContainerRight}>
                  <DetailActionsWithStats
                    statusLabel={userStatus}
                    statusVariant={statusVariant}
                    statsData={statsData || []}
                    statusClassName={classes.status}
                    deactivateButtonClassName={classes.deactivateButton}
                    editButtonClassName={classes.editButton}
                    onDeactivate={handleActivateDeactivateClick}
                  />
                </div>
              </Col>
            </Row>
            <Row className="g-4 mt-4">
              {transformedCases.length > 0 ? (
                <>
                  {transformedCases.map((item) => (
                    <Col className="col-12 col-md-4" key={item.id}>
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
                          clientName: item.clientName,
                        }}
                      />
                    </Col>
                  ))}
                  {totalRecords > RECORDS_LIMIT && (
                    <Col className="col-12">
                      <div >
                        <Pagination
                          currentPage={currentPage}
                          totalRecords={totalRecords}
                          limit={RECORDS_LIMIT}
                          onPageChange={(page) => {
                            setCurrentPage(page);
                          }}
                          totalTextLabel="Cases"
                        />
                      </div>
                    </Col>
                  )}
                </>
              ) : (
                <Col className="col-12">
                  <NoDataFound text="No cases found" />
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Wrapper>
      
    </div>
  );
};

UserManagementDetailTemplate.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default UserManagementDetailTemplate;
