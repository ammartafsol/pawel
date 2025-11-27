"use client";
import React, { useState } from "react";
import classes from "./AuditTrackingTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import CircularCaseProgressChart from "@/components/atoms/CircularCaseProgressChart/CircularCaseProgressChart";
import { circularCaseProgressChartData, caseManagementCardsData, myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import Calender from "@/components/molecules/Calender/Calender";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import { staffDashboardTableBody } from "@/developementContent/TableBody/StaffDashboardTableBody";
import { reactActivities } from "@/developementContent/Enums/enum";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { useRouter } from "next/navigation";

const AuditTrackingTemplate = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(reactActivities[0]);
  
  // Show only first 2 cards
  const overdueCases = caseManagementCardsData.slice(0, 2);

  return (
    <div className="p24">
      <Row>
        <Col md={5}>
          <Wrapper
            contentClassName={classes?.contentClassName}
            title="Audit Tracking"
          >
            <div className={classes.circularCaseProgressChart}>
              <CircularCaseProgressChart data={circularCaseProgressChartData} />
            </div>
          </Wrapper>
        </Col>
        <Col md={7}>
          <Wrapper
            contentClassName={classes?.contentClassName}
            title="Overdue Case Progresses"
          >
            <div className={classes.overdueCasesContainer}>
              <Row className="g-4">
                {overdueCases.map((item) => (
                  <Col className="col-12 col-md-6" key={item.id}>
                    <CaseProgressCard 
                      isStatusVariant
                      routePath={`/staff/case-management/${item.id}`}
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
            </div>
          </Wrapper>
        </Col>
        <Col sm={12}>
        <Calender  events={myEventsList} />
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
                dropdownOptions={reactActivities}
                dropdownPlaceholder="Select Activity"
                selectedDropdownValue={selectedDropdownValue}
                setSelectedDropdownValue={setSelectedDropdownValue}
              />
            }
            contentClassName={classes.contentClassName}
          >
            <ResponsiveTable
              tableHeader={staffDashboardTableHeader}
              data={staffDashboardTableBody}
            />
          </Wrapper>
        </Col>
      </Row>
    </div>
  );
};

export default AuditTrackingTemplate;
